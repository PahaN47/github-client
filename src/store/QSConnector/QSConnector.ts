import { IReactionDisposer, computed, makeObservable, reaction } from 'mobx';
import QueryStore from 'store/RootStore/QueryStore';
import type { QueryParamNormailzer } from 'store/models/QueryStore';

import type { ILocalStore } from 'utils/hooks/useLocalStore';

type QSConnectorOptions<PV> = { name: string; parser: QueryParamNormailzer<PV>; watchValue: () => PV };

export default class QSConnector<PV> implements ILocalStore {
  private _updateReaction: IReactionDisposer;
  private _parser: QueryParamNormailzer<PV>;
  private _queryStore: QueryStore;
  private readonly _paramName: string;

  constructor(queryStore: QueryStore, { name, parser, watchValue }: QSConnectorOptions<PV>) {
    this._queryStore = queryStore;
    this._paramName = name;
    this._parser = parser;

    this._updateReaction = reaction(watchValue, this._watchChange.bind(this), { fireImmediately: true });

    makeObservable(this, { value: computed });
  }

  get value(): PV {
    return this._parser(this._queryStore.params?.[this._paramName]);
  }

  _isEqualWithQValue(value: PV): boolean {
    if (Array.isArray(value)) {
      return JSON.stringify(value) === JSON.stringify(this.value);
    }

    return this.value === value;
  }

  private _watchChange(value: PV): void {
    if (this._isEqualWithQValue(value)) {
      return;
    }

    this._queryStore.setParam(this._paramName, value);
  }

  destroy() {
    this._updateReaction();
  }
}
