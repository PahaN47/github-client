import { makeObservable, observable } from 'mobx';
import QueryStore, { QueryStoreProps } from './QueryStore';

export type RootStoreProps = {
  queryStoreProps: QueryStoreProps;
};

export default class RootStore {
  readonly query: QueryStore;

  constructor({ queryStoreProps }: RootStoreProps) {
    this.query = new QueryStore(queryStoreProps);

    makeObservable(this, {
      query: observable,
    });
  }
}
