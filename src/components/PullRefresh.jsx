import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { RefreshCw } from 'lucide-react';

export default function PullRefresh({ onRefresh, children }) {
  const { pullDistance, refreshing, handlers } = usePullToRefresh(onRefresh);
  const active = pullDistance > 0 || refreshing;
  return (
    <div {...handlers} className="relative" style={{ transform: `translateY(${pullDistance}px)`, transition: pullDistance > 0 ? 'none' : 'transform 0.2s ease' }}>
      {active && (
        <div className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center" style={{ top: -36, height: 36 }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-800">
            <RefreshCw size={16} className={`text-teal-600 dark:text-teal-400 ${refreshing ? 'animate-spin' : ''}`} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}