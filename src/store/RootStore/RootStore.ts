import { ILocalStore } from 'utils/hooks';
import QueryStore, { QueryStoreProps } from './QueryStore';

export type RootStoreProps = {
  queryStoreProps: QueryStoreProps;
};

export default class RootStore implements ILocalStore {
  readonly query: QueryStore;

  constructor({ queryStoreProps }: RootStoreProps) {
    this.query = new QueryStore(queryStoreProps);
  }

  destroy() {}
}
