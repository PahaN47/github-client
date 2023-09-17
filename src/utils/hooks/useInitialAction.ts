import { useEffect, useRef } from 'react';

export const useInitialAction = (callback: () => void) => {
  const mountedRef = useRef<boolean>(false);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    if (!mountedRef.current) {
      callbackRef.current();
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
  });
};
