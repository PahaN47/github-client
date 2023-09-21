import { action, computed, makeObservable, observable } from 'mobx';

export interface IPaginationStore {
  page: number;
  pageLimit: number;
  pageCount: number;
  lastPage: number;
  hasMore: boolean;
}

type PrivateFields = '_itemCount';

export default class PaginationStore implements IPaginationStore {
  page: number;
  pageLimit: number;
  lastPage: number;
  private _itemCount: number;

  constructor(pageLimit: number) {
    this.page = 1;
    this.pageLimit = pageLimit;
    this.lastPage = 1;
    this._itemCount = 0;

    makeObservable<this, PrivateFields>(this, {
      hasMore: computed,
      setLastPage: action.bound,
      incrementLastPage: action.bound,
      setItemCount: action.bound,
      _itemCount: observable,
      setPage: action.bound,
      setPageLimit: action.bound,
      page: observable,
      pageLimit: observable,
      pageCount: computed,
      lastPage: observable,
    });
  }

  get pageCount() {
    return Math.ceil(this._itemCount / this.pageLimit);
  }

  get hasMore() {
    return this.page < this.pageCount;
  }

  setPage(page: number) {
    this.page = page;
  }

  setPageLimit(pageLimit: number) {
    if (pageLimit > 0) {
      this.pageLimit = pageLimit;
    }
  }

  setLastPage(lastPage: number) {
    this.lastPage = lastPage;
  }

  incrementLastPage() {
    this.setLastPage(this.lastPage + 1);
  }

  setItemCount(itemCount: number) {
    this._itemCount = itemCount;
  }
}
