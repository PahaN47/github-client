import QueryStore, { QueryParams } from './QueryStore';

export default class RootStore {
  readonly query: QueryStore<QueryParams> = new QueryStore();
}
