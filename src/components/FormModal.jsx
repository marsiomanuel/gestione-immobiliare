import { motion, AnimatePresence } from 'framer-motion';

export default function FormModal({ isOpen, onClose, children, maxWidth = 'max-w-xl' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 dark:bg-black/60 sm:items-center sm:p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl bg-slate-50 dark:bg-slate-900 shadow-2xl sm:rounded-3xl`}
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
          >
            <div className="flex justify-center pt-3 sm:hidden"><div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700" /></div>
            <div className="p-6 pt-4 sm:pt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}