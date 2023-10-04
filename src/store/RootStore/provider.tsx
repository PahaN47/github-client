import React, { createContext, useContext, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStore } from 'utils/hooks';
import RootStore from './RootStore';

export const RootStoreContext = createContext<RootStore>(null as unknown as RootStore);

const RootStoreProvider = ({ children }: React.PropsWithChildren) => {
  const { search } = useLocation();

  const rootStore = useLocalStore(
    () =>
      new RootStore({
        queryStoreProps: { initialQs: search },
        lastSeenReposStoreProps: { length: 5 },
        windowSizeStoreProps: { initialWidth: window.innerWidth, initialHeight: window.innerHeight },
      }),
  );

  useEffect(() => {
    rootStore.query.setQueryString(search);
  }, [search]);

  useLayoutEffect(() => {
    const handleResize = () => rootStore.windowSize.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
};

export const useRootStore = (): RootStore => {
  const context = useContext(RootStoreContext);

  if (!context) {
    throw new Error('RootStoreContext is not found!');
  }

  return context;
};

export default RootStoreProvider;
