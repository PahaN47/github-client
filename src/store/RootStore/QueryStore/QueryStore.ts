import { action, makeObservable, observable } from 'mobx';
import * as qs from 'qs';
import { NavigateFunction } from 'react-router-dom';

export interface IQueryStore {
  params: qs.ParsedQs | null;
}

export type QueryStoreProps = {
  initialQs: string;
  navigate: NavigateFunction;
};

class QueryStore implements IQueryStore {
  private _navigate: NavigateFunction;
  private _incomingParams: Record<string, unknown> = {};

  params: qs.ParsedQs | null = null;

  constructor({ initialQs, navigate }: QueryStoreProps) {
    this._navigate = navigate;

    this.update(initialQs.startsWith('?') ? initialQs.slice(1) : initialQs);

    makeObservable(this, {
      update: action.bound,
      params: observable.ref,
    });
  }

  setParam(name: string, value: unknown): void {
    this._incomingParams[name] = value;

    const newParams = {
      ...this.params,
      ...this._incomingParams,
    };

    this._navigate({ search: qs.stringify(newParams) }, { replace: true });
  }

  update(queryString: string) {
    this.params = qs.parse(queryString.startsWith('?') ? queryString.slice(1) : queryString);

    this._incomingParams = {};
  }
}

export default QueryStore;
