import { action, makeObservable, observable } from 'mobx';
import { Collection, KeysMatching, expandCollection, normalizeCollection } from 'store/models/shared';

export interface ICollectionStore<K extends string | number, T> extends Collection<K, T> {}

type PrivateFields = '_key';

export default class CollectionStore<K extends string | number, T> implements ICollectionStore<K, T> {
  private _key: KeysMatching<T, K>;
  order: K[] = [];
  entities: Record<K, T> = {} as Record<K, T>;

  constructor(list: T[], key: KeysMatching<T, K>) {
    this._key = key;

    makeObservable<this, PrivateFields>(this, {
      expand: action.bound,
      set: action.bound,
      _key: false,
      order: observable.ref,
      entities: observable.ref,
    });

    this.set(list);
  }

  set(list: T[]) {
    const { order, entities } = normalizeCollection(list, this._key);
    this.order = order;
    this.entities = entities;
  }

  expand(newList: T[]) {
    const { order, entities } = expandCollection({ order: this.order, entities: this.entities }, newList, this._key);
    this.order = order;
    this.entities = entities;
  }
}
