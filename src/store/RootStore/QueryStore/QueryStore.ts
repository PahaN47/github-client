import { action, makeObservable, observable } from 'mobx';
import * as qs from 'qs';

export interface IQueryStore {
  queryString: string;
  params: qs.ParsedQs | null;
}

class QueryStore implements IQueryStore {
  queryString: string = '';
  params: qs.ParsedQs | null = null;

  constructor() {
    makeObservable(this, {
      setQueryString: action.bound,
      params: observable.ref,
      queryString: observable,
    });
  }

  setQueryString(queryString: string) {
    const queryStringSlice = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    if (queryStringSlice !== this.queryString) {
      this.queryString = queryStringSlice;
      this.params = this.queryString ? qs.parse(this.queryString) : null;
    }
  }
}

export default QueryStore;
