import React, { createContext, useContext, useEffect } from 'react';
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
      }),
  );

  useEffect(() => {
    rootStore.query.setQueryString(search);
  }, [search]);

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
