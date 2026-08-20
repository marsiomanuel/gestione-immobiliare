import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) throw new Error('Configurazione Supabase mancante');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const tables = { Property: 'properties', Owner: 'owners', Contract: 'contracts', Expense: 'expenses', RentPayment: 'rent_payments', Reminder: 'reminders', Evaluation: 'evaluations' };
const unwrap = (row) => ({ id: row.id, user_id: row.user_id, ...row.data, created_date: row.created_at, updated_date: row.updated_at });
const sortRows = (rows, sort = '-created_date') => {
  const descending = sort?.startsWith('-');
  const field = (sort || 'created_date').replace(/^-/, '');
  return [...rows].sort((a, b) => {
    const comparison = String(a[field] ?? '').localeCompare(String(b[field] ?? ''), 'it', { numeric: true });
    return descending ? -comparison : comparison;
  });
};
const currentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error || new Error('Accesso richiesto');
  return data.user;
};

const entityApi = (table) => ({
  async list(sort, limit = 1000) {
    const { data, error } = await supabase.from(table).select('*').limit(limit);
    if (error) throw error;
    return sortRows(data.map(unwrap), sort);
  },
  async get(id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return unwrap(data);
  },
  async create(values) {
    const user = await currentUser();
    const { data, error } = await supabase.from(table).insert({ user_id: user.id, data: values }).select().single();
    if (error) throw error;
    return unwrap(data);
  },
  async bulkCreate(records) {
    const user = await currentUser();
    const { data, error } = await supabase.from(table).insert(records.map((values) => ({ user_id: user.id, data: values }))).select();
    if (error) throw error;
    return data.map(unwrap);
  },
  async update(id, values) {
    const current = await this.get(id);
    const { id: _id, user_id: _userId, created_date: _created, updated_date: _updated, ...existing } = current;
    const { data, error } = await supabase.from(table).update({ data: { ...existing, ...values }, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return unwrap(data);
  },
  async delete(id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },
});

const entities = Object.fromEntries(Object.entries(tables).map(([name, table]) => [name, entityApi(table)]));
entities.User = { async delete() { const { error } = await supabase.rpc('delete_my_account'); if (error) throw error; } };

const auth = {
  async me() { return currentUser(); },
  async loginViaEmailPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async register({ email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },
  async verifyOtp({ email, otpCode }) {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
    if (error) throw error;
    return { ...data, access_token: data.session?.access_token };
  },
  async resendOtp(email) {
    const { data, error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
    return data;
  },
  async loginWithProvider(provider, redirectTo) {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) throw error;
    return data;
  },
  async logout() { const { error } = await supabase.auth.signOut(); if (error) throw error; },
  async resetPasswordRequest(email) {
    const redirectTo = new URL('reset-password', window.location.href).href;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    return data;
  },
  async resetPassword({ newPassword }) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  },
  async setToken() {},
  redirectToLogin(returnTo) {
    const url = new URL('login', window.location.href);
    if (returnTo) url.searchParams.set('returnTo', returnTo);
    window.location.assign(url);
  },
};

const integrations = { Core: { async UploadFile({ file }) {
  const user = await currentUser();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from('documents').upload(path, file);
  if (error) throw error;
  const { data, error: signError } = await supabase.storage.from('documents').createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signError) throw signError;
  return { file_url: data.signedUrl, file_path: path };
} } };

const admin = {
  async listUsers() {
    const { data, error } = await supabase.rpc('admin_list_users');
    if (error) throw error;
    return data;
  },
};

export const base44 = { auth, entities, integrations, admin, supabase };
