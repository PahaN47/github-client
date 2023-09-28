import { computed, makeObservable, observable } from 'mobx';
import router from 'router';
import QueryStore from 'store/RootStore/QueryStore';
import { QueryNormalizer, QueryParamNormalizerObject, normalizeQuery } from 'store/models/QueryStore';
import { DeepPartial } from 'store/types';
import { getQueryString } from 'utils/getQueryString';
import { ILocalStore } from 'utils/hooks';

export interface IParsedQueryStore<T extends Record<string, unknown>> {
  params: T;
}

type PrivateFields = '_parser' | '_queryStore';

export default class ParsedQueryStore<T extends Record<string, unknown>> implements IParsedQueryStore<T>, ILocalStore {
  private _parser: QueryNormalizer<T>;
  private _queryStore: QueryStore;

  constructor(queryStore: QueryStore, parserObject: QueryParamNormalizerObject<T>) {
    this._queryStore = queryStore;
    this._queryStore.setQueryString(router.state.location.search);
    this._parser = normalizeQuery(parserObject);

    makeObservable<this, PrivateFields>(this, {
      params: computed,
      _queryStore: observable.deep,
      setQuery: false,
      _parser: false,
      destroy: false,
    });
  }

  get params(): T {
    return this._parser(this._queryStore.params);
  }

  setQuery(params: DeepPartial<T>, replace?: boolean) {
    const queryString = getQueryString(params);
    router.navigate({ search: queryString }, { replace });
  }

  destroy() {
    return;
  }
}
