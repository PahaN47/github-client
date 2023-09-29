import { localStorageKeys } from 'config/localStorage';
import { CurrentRepoModel } from 'store/models/CurrentRepoStore';
import {
  LastSeenRepo,
  normalizeLastSeenRepoFromCurrent,
  normalizeLastSeenRepoList,
} from 'store/models/LastSeenReposStore';
import { Collection, normalizeCollection } from 'store/models/shared';

export interface ILastSeenRepoStore {
  repos: Collection<number, LastSeenRepo>;
}

export type LastSeenReposStoreProps = {
  length?: number;
};

class LastSeenReposStore implements ILastSeenRepoStore {
  private _key: string = localStorageKeys.LAST_REPOS;
  private _length: number;

  constructor({ length = 5 }: LastSeenReposStoreProps) {
    this._length = length;
  }

  addRepo(newItem: CurrentRepoModel) {
    const oldList = normalizeLastSeenRepoList(localStorage.getItem(this._key));
    if (oldList[0]?.id === newItem.id) {
      return;
    }
    const newItemNormalized = normalizeLastSeenRepoFromCurrent(newItem);
    const newList = [newItemNormalized, ...oldList.filter(({ id }) => id !== newItemNormalized.id)];
    const newListLimited = newList.length >= this._length ? newList.slice(0, this._length) : newList;

    localStorage.setItem(this._key, JSON.stringify(newListLimited));
  }

  get repos(): Collection<number, LastSeenRepo> {
    const storageList = normalizeLastSeenRepoList(localStorage.getItem(this._key));

    return normalizeCollection<number, LastSeenRepo>(storageList, 'id');
  }
}

export default LastSeenReposStore;
