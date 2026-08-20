import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useModalParam(key) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const openedHere = useRef(false);
  const isOpen = searchParams.get('open') === key;

  const open = () => {
    const next = new URLSearchParams(searchParams);
    next.set('open', key);
    openedHere.current = true;
    setSearchParams(next, { replace: false });
  };

  const close = () => {
    if (openedHere.current) {
      openedHere.current = false;
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete('open');
    setSearchParams(next, { replace: true });
  };

  return { isOpen, open, close };
}
