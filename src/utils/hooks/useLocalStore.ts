import { useEffect, useRef } from 'react';

export interface ILocalStore {
  destroy: () => void;
}

export const useLocalStore = <T extends ILocalStore>(init: () => T): T => {
  const store = useRef<T | null>(null);

  if (!store.current) {
    store.current = init();
  }

  useEffect(() => () => store.current?.destroy(), []);

  return store.current;
};
