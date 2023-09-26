import { useContext } from 'react';
import { RootStoreContext } from 'store/RootStore';
import LastSeenReposStore from 'store/RootStore/LastSeenReposStore';

export const useLastSeenRepos = (): LastSeenReposStore => {
  const store = useContext(RootStoreContext).lastSeenRepos;

  return store;
};
