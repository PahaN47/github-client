import { action, computed, makeObservable, observable } from 'mobx';
import * as qs from 'qs';

export interface IQueryStore {
  queryString: string;
  params: qs.ParsedQs | null;
}

export type QueryStoreProps = {
  initialQs: string;
};

class QueryStore implements IQueryStore {
  queryString: string;

  constructor({ initialQs }: QueryStoreProps) {
    this.queryString = initialQs.startsWith('?') ? initialQs.slice(1) : initialQs;

    makeObservable(this, {
      setQueryString: action.bound,
      params: computed,
      queryString: observable,
    });
  }

  get params(): qs.ParsedQs | null {
    if (!this.queryString) {
      return null;
    }

    return qs.parse(this.queryString);
  }

  setQueryString(queryString: string) {
    const queryStringSlice = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    if (queryStringSlice !== this.queryString) {
      this.queryString = queryStringSlice;
    }
  }
}

export default QueryStore;
