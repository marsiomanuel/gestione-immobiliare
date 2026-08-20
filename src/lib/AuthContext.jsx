import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { base44, supabase } from '@/api/base44Client';
import { appUrl } from '@/lib/authReturnTo';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        const { data: roleRow } = await supabase.from('user_roles').select('role').eq('user_id', sessionUser.id).maybeSingle();
        setRole(roleRow?.role || 'user');
      } else {
        setRole('user');
      }
    } catch (error) {
      setAuthError({ type: 'auth_required', message: error.message });
      setUser(null);
    } finally {
      setAuthChecked(true);
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) setRole('user');
      setAuthChecked(true);
      setIsLoadingAuth(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (active) setRole(data?.role || 'user'); });
    return () => { active = false; };
  }, [user?.id]);

  const logout = async (shouldRedirect = true) => {
    await base44.auth.logout();
    setUser(null);
    setRole('user');
    if (shouldRedirect) window.location.assign(appUrl('/login'));
  };

  const value = useMemo(() => ({
    user,
    role,
    isAdmin: role === 'admin',
    isAuthenticated: Boolean(user),
    isLoadingAuth,
    isLoadingPublicSettings: false,
    authError,
    appPublicSettings: null,
    authChecked,
    logout,
    navigateToLogin: () => window.location.assign(appUrl('/login')),
    checkUserAuth,
    checkAppState: checkUserAuth,
  }), [user, role, isLoadingAuth, authError, authChecked]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
