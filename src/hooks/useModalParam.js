import { useSearchParams } from 'react-router-dom';

export function useModalParam(key) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get('open') === key;

  const open = () => {
    const next = new URLSearchParams(searchParams);
    next.set('open', key);
    setSearchParams(next, { replace: false });
  };

  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('open');
    setSearchParams(next, { replace: true });
  };

  return { isOpen, open, close };
}