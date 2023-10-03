import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends Element>(ref: React.RefObject<T>, callback: (e?: MouseEvent) => void) => {
  const callbackRef = useRef<typeof callback | null>(null);

  if (!callbackRef.current) {
    callbackRef.current = callback;
  }

  useEffect(() => {
    const element = ref.current;
    const cb = callbackRef.current;

    if (!element || !cb) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (!element.contains(e.target as Node | null)) {
        cb(e);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
};
