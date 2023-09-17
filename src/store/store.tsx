import React, { useContext } from 'react';
import CurrentRepoStore, { currentRepoStoreInitialValue } from 'store/CurrentRepoStore';
import RepoListStore, { repoListStoreInitialValue } from 'store/RepoListStore';

export interface StoreType {
  repoList: RepoListStore;
  currentRepo: CurrentRepoStore;
}

const storeInitialValue: StoreType = {
  repoList: new RepoListStore(repoListStoreInitialValue),
  currentRepo: new CurrentRepoStore(currentRepoStoreInitialValue),
};

class Store implements StoreType {
  repoList: RepoListStore;
  currentRepo: CurrentRepoStore;

  constructor({ repoList, currentRepo }: StoreType) {
    this.repoList = repoList;
    this.currentRepo = currentRepo;
  }
}

const StoreContext = React.createContext<Store>(null as unknown as Store);

export type StoreProviderProps = React.PropsWithChildren;

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => (
  <StoreContext.Provider value={new Store(storeInitialValue)}>{children}</StoreContext.Provider>
);

export const useStore = <T,>(query: (store: Store) => T) => {
  const context = useContext(StoreContext);

  return query(context);
};

export default StoreProvider;
