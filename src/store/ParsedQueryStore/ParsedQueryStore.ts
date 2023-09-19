import { action, computed, makeObservable } from 'mobx';
import * as qs from 'qs';
import rootStore from 'store/RootStore';
import { QueryNormalizer, QueryParamNormalizerObject, normalizeQuery } from 'store/models/QueryStore';
import { DeepPartial } from 'store/types';
import { ILocalStore } from 'utils/hooks';

export interface IParsedQueryStore<T extends Record<string, unknown>> {
  params: T;
}

type PrivateFields = '_parser';

export default class ParsedQueryStore<T extends Record<string, unknown>> implements IParsedQueryStore<T>, ILocalStore {
  private _parser: QueryNormalizer<T>;

  constructor(initialQs: string, parserObject: QueryParamNormalizerObject<T>) {
    rootStore.query.setQueryString(initialQs);
    this._parser = normalizeQuery(parserObject);

    makeObservable<this, PrivateFields>(this, {
      setQuery: action.bound,
      _parser: false,
      params: computed,
      destroy: action.bound,
    });
  }

  get params(): T {
    return this._parser(rootStore.query.params);
  }

  setQuery(params: DeepPartial<T>) {
    rootStore.query.setQueryString(qs.stringify(params, { indices: false }));
  }

  destroy() {
    return;
  }
}
