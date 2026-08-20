export default function StickyFilters({ children }) {
  return (
    <div className="sticky z-20 -mx-4 mt-4 border-b border-slate-200 bg-[#f4f6f5]/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-6 sm:px-6" style={{ top: 'env(safe-area-inset-top)' }}>
      {children}
    </div>
  );
}