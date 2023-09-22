import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type QueryStore from 'store/RootStore/QueryStore';
import { useLocalStore } from 'utils/hooks/useLocalStore';
import RootStore from './RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

const RootStoreProvider = ({ children }: React.PropsWithChildren) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const rootStore = useLocalStore(() => new RootStore({ queryStoreProps: { initialQs: search, navigate } }));

  useEffect(() => {
    rootStore.query.update(search);
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

export const useQueryStore = (): QueryStore => useRootStore().query;

export default RootStoreProvider;
