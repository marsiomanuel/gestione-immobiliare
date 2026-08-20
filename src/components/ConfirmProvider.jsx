import { createContext, useContext, useState, useCallback } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, options: null, resolve: null });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const close = (result) => {
    state.resolve?.(result);
    setState((s) => ({ open: false, options: null, resolve: null }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={state.open} onOpenChange={(open) => { if (!open && state.open) close(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.options?.title || 'Conferma'}</AlertDialogTitle>
            {state.options?.description && <AlertDialogDescription>{state.options.description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => close(false)} className="active:scale-[0.98]">Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => close(true)} className={`active:scale-[0.98] ${state.options?.destructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}`}>{state.options?.confirmLabel || 'Conferma'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}