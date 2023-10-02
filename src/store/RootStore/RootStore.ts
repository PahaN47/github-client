import { ILocalStore } from 'utils/hooks';
import AuthStore from './AuthStore';
import LastSeenReposStore, { LastSeenReposStoreProps } from './LastSeenReposStore';
import QueryStore, { QueryStoreProps } from './QueryStore';

export type RootStoreProps = {
  queryStoreProps: QueryStoreProps;
  lastSeenReposStoreProps: LastSeenReposStoreProps;
};

export default class RootStore implements ILocalStore {
  readonly query: QueryStore;
  readonly lastSeenRepos: LastSeenReposStore;
  readonly auth: AuthStore;

  constructor({ queryStoreProps, lastSeenReposStoreProps }: RootStoreProps) {
    this.query = new QueryStore(queryStoreProps);
    this.lastSeenRepos = new LastSeenReposStore(lastSeenReposStoreProps);
    this.auth = new AuthStore(this.query);
  }

  destroy() {
    this.auth.destroy();
  }
}
