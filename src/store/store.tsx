import { makeAutoObservable } from 'mobx';
import React, { useContext } from 'react';
import RepoStore, { repoStoreInitialValue } from 'store/RepoStore';

export interface StoreType {
  repos: RepoStore;
}

export const storeInitialValue: StoreType = {
  repos: new RepoStore(repoStoreInitialValue),
};

export class Store implements StoreType {
  repos: RepoStore;

  constructor({ repos }: StoreType) {
    this.repos = repos;

    makeAutoObservable(this);
  }
}

const StoreContext = React.createContext<Store>(null as unknown as Store);

export type StoreProviderProps = {
  children: React.ReactNode;
};

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => (
  <StoreContext.Provider value={new Store(storeInitialValue)}>{children}</StoreContext.Provider>
);

export const useStore = <T,>(query: (store: Store) => T) => {
  const context = useContext(StoreContext);

  return query(context);
};

export default StoreProvider;
