import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { localStorageKeys } from 'config/localStorage';
import CollectionStore from 'store/CollectionStore';
import { CurrentRepoModel } from 'store/models/CurrentRepoStore';
import {
  LastSeenRepo,
  normalizeLastSeenRepoFromCurrent,
  normalizeLastSeenRepoList,
} from 'store/models/LastSeenReposStore';
import { Collection } from 'store/models/shared';

export interface ILastSeenRepoStore {
  repos: Collection<number, LastSeenRepo>;
}

export type LastSeenReposStoreProps = {
  length?: number;
};

type PrivateFields = '_key' | '_length' | '_repos' | '_isStorageDifferent';

class LastSeenReposStore implements ILastSeenRepoStore {
  private _key: string = localStorageKeys.LAST_REPOS;
  private _length: number;
  private _repos: CollectionStore<number, LastSeenRepo>;

  constructor({ length = 5 }: LastSeenReposStoreProps) {
    const jsonList = localStorage.getItem(this._key);
    this._length = length;
    const storageList = normalizeLastSeenRepoList(jsonList).slice(0, this._length);
    this._repos = new CollectionStore<number, LastSeenRepo>(storageList, 'id');

    makeObservable<this, PrivateFields>(this, {
      _isStorageDifferent: action.bound,
      _key: false,
      _length: false,
      _repos: observable,
      addRepo: action.bound,
      repos: computed,
    });
  }

  private _isStorageDifferent(storageList: LastSeenRepo[]) {
    return runInAction(
      () =>
        this._repos.order.length !== storageList.length &&
        this._repos.order.some((id, index) => id !== storageList[index]?.id),
    );
  }

  addRepo(newItem: CurrentRepoModel) {
    const oldList = normalizeLastSeenRepoList(localStorage.getItem(this._key));
    if (oldList[0]?.id === newItem.id) {
      return;
    }
    const newItemNormalized = normalizeLastSeenRepoFromCurrent(newItem);
    const newList = [newItemNormalized, ...oldList.filter(({ id }) => id !== newItemNormalized.id)];
    const newListLimited = newList.length >= this._length ? newList.slice(0, this._length) : newList;

    this._repos.set(newListLimited);
    localStorage.setItem(this._key, JSON.stringify(newListLimited));
  }

  get repos(): Collection<number, LastSeenRepo> {
    const storageList = normalizeLastSeenRepoList(localStorage.getItem(this._key));
    const isStorageDifferent = this._isStorageDifferent(storageList);

    if (isStorageDifferent) {
      this._repos.set(storageList.slice(0, this._length));
    }

    return {
      order: this._repos.order,
      entities: this._repos.entities,
    };
  }
}

export default LastSeenReposStore;
