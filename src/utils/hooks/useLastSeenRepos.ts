import { useRootStore } from 'store/RootStore';
import LastSeenReposStore from 'store/RootStore/LastSeenReposStore';

export const useLastSeenRepos = (): LastSeenReposStore => {
  const store = useRootStore().lastSeenRepos;

  return store;
};
