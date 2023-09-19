import QueryStore from './QueryStore';

export default class RootStore {
  readonly query: QueryStore = new QueryStore();
}
