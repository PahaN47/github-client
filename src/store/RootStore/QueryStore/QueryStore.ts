import { action, computed, makeObservable, observable } from 'mobx';
import * as qs from 'qs';

export type QueryParam = string | number | boolean | string[] | number[] | boolean[] | undefined;

export type QueryParams = {
  [key: string]: QueryParam | QueryParams;
};

export type UnparsedQueryParams<T extends QueryParams> = {
  [K in keyof T]: T[K] extends QueryParams
    ? UnparsedQueryParams<T[K]>
    : T[K] extends string | number | boolean | undefined
    ? string | undefined
    : string[] | string | undefined;
};

export interface IQueryStore<T extends QueryParams> {
  queryString: string;
  params: UnparsedQueryParams<T> | null;
}

type PrivateFields = '_queryString';

class QueryStore<T extends QueryParams> implements IQueryStore<T> {
  private _queryString: string = '';

  constructor() {
    makeObservable<QueryStore<T>, PrivateFields>(this, {
      setQueryString: action,
      params: computed,
      queryString: computed,
      _queryString: observable.ref,
    });
  }

  get queryString(): string {
    return this.queryString;
  }

  get params(): UnparsedQueryParams<T> | null {
    if (!this._queryString) {
      return null;
    }
    return qs.parse(this._queryString) as UnparsedQueryParams<T>;
  }

  setQueryString = (qs: string) => {
    this._queryString = qs.startsWith('?') ? qs.slice(1) : qs;
  };
}

export default QueryStore;
