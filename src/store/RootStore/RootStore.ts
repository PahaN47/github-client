import { ILocalStore } from 'utils/hooks';
import LastSeenReposStore, { LastSeenReposStoreProps } from './LastSeenReposStore';
import QueryStore, { QueryStoreProps } from './QueryStore';

export type RootStoreProps = {
  queryStoreProps: QueryStoreProps;
  lastSeenReposStoreProps: LastSeenReposStoreProps;
};

export default class RootStore implements ILocalStore {
  readonly query: QueryStore;
  readonly lastSeenRepos: LastSeenReposStore;

  constructor({ queryStoreProps, lastSeenReposStoreProps }: RootStoreProps) {
    this.query = new QueryStore(queryStoreProps);
    this.lastSeenRepos = new LastSeenReposStore(lastSeenReposStoreProps);
  }

  destroy() {
    return;
  }
}
