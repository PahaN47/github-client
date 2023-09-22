import { createContext, useContext } from 'react';

import type RepoListStore from './RepoListStore';

const RepoListStoreContext = createContext<RepoListStore | null>(null);

export const useRepoList = (): RepoListStore => {
  const context = useContext(RepoListStoreContext);

  if (!context) {
    throw new Error('RepoListStoreContext is not found!');
  }

  return context;
};

export default RepoListStoreContext;
