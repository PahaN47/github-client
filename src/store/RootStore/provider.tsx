import React, { createContext } from 'react';
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

  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
};

export default RootStoreProvider;
