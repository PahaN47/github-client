import { ILocalStore } from 'utils/hooks';
import AuthStore from './AuthStore';
import LastSeenReposStore, { LastSeenReposStoreProps } from './LastSeenReposStore';
import QueryStore, { QueryStoreProps } from './QueryStore';
import WindowSizeStore, { WindowSizeStoreProps } from './WindowSizeStore';

export type RootStoreProps = {
  queryStoreProps: QueryStoreProps;
  lastSeenReposStoreProps: LastSeenReposStoreProps;
  windowSizeStoreProps: WindowSizeStoreProps;
};

export default class RootStore implements ILocalStore {
  readonly query: QueryStore;
  readonly lastSeenRepos: LastSeenReposStore;
  readonly auth: AuthStore;
  readonly windowSize: WindowSizeStore;

  constructor({ queryStoreProps, lastSeenReposStoreProps, windowSizeStoreProps }: RootStoreProps) {
    this.query = new QueryStore(queryStoreProps);
    this.lastSeenRepos = new LastSeenReposStore(lastSeenReposStoreProps);
    this.auth = new AuthStore(this.query);
    this.windowSize = new WindowSizeStore(windowSizeStoreProps);
  }

  destroy() {
    this.auth.destroy();
  }
}
