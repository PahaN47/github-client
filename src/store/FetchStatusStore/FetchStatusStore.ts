import { action, computed, makeObservable, observable } from 'mobx';
import { FetchStatus } from 'store/types';
export interface IFetchStatusStore {
  isPending: boolean;
  isIdle: boolean;
  isFulfilled: boolean;
  isRejected: boolean;
}

type PrivateFields = '_status';

class CurrentRepoStore implements IFetchStatusStore {
  private _status: FetchStatus = FetchStatus.IDLE;

  constructor() {
    makeObservable<this, PrivateFields>(this, {
      set: action.bound,
      _status: observable,
      isIdle: computed,
      isPending: computed,
      isFulfilled: computed,
      isRejected: computed,
    });
  }

  get isIdle() {
    return this._status === FetchStatus.IDLE;
  }
  get isPending() {
    return this._status === FetchStatus.PENDING;
  }
  get isFulfilled() {
    return this._status === FetchStatus.FULFILLED;
  }
  get isRejected() {
    return this._status === FetchStatus.REJECTED;
  }

  set(status: FetchStatus) {
    this._status = status;
  }
}

export default CurrentRepoStore;
