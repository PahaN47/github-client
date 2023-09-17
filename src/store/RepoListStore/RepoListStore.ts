import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import { RepoModel, RepoApi, normalizeRepo } from 'store/models/RepoListStore';
import { Collection, expandCollection, getEmptyCollection, normalizeCollection } from 'store/models/shared';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { getResponseItemCount } from 'utils/getResponseItemCount';
import { ILocalStore } from 'utils/hooks/useLocalStore';
import { AddReposProps, GetRepoListProps } from './RepoListStore.types';

export interface IRepoListStore {
  repoList: Collection<number, RepoModel>;
  repoListStatus: FetchStatus;
  pageLimit: number;
  repoCount: number;
}

type PrivateFileds = '_repoList' | '_repoListStatus' | '_pageLimit' | '_repoCount' | '_lastPage';

class RepoListStore implements IRepoListStore, ILocalStore {
  private _repoList: Collection<number, RepoModel> = getEmptyCollection();
  private _repoListStatus: FetchStatus = FetchStatus.IDLE;
  private _pageLimit: number = 9;
  private _repoCount: number = 0;
  private _lastPage: number = 0;

  constructor() {
    makeObservable<RepoListStore, PrivateFileds>(this, {
      addRepos: action,
      hasMore: computed,
      repoList: computed,
      repoListStatus: computed,
      pageLimit: computed,
      repoCount: computed,
      _lastPage: observable,
      _repoCount: observable,
      _pageLimit: observable,
      _repoListStatus: observable,
      _repoList: observable.ref,
      destroy: action,
      getRepoList: action,
      resetRepoList: action,
      setPageLimit: action,
    });
  }

  get repoList() {
    return this._repoList;
  }

  get repoListStatus() {
    return this._repoListStatus;
  }

  get pageLimit() {
    return this._pageLimit;
  }

  get repoCount() {
    return this._repoCount;
  }

  get hasMore() {
    return this._repoCount <= this.repoList.order.length;
  }

  getRepoList = ({ org, page, types }: GetRepoListProps) => {
    this._repoListStatus = FetchStatus.PENDGING;

    const requestRepoList = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page,
          per_page: this._pageLimit,
          type: types,
        },
      })
      .then(({ data }) => data.map((repo) => normalizeRepo(repo)));

    const requestRepoCount = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page: 1,
          per_page: 1,
          type: types,
        },
      })
      .then((resp) => getResponseItemCount(resp));

    Promise.all([requestRepoList, requestRepoCount])
      .then(([repoList, repoCount]) => {
        runInAction(() => {
          this._repoList = normalizeCollection(repoList, 'id');
          this._repoCount = repoCount;
          this._repoListStatus = FetchStatus.FULFILLED;
          this._lastPage = 1;
        });
      })
      .catch(() => {
        runInAction(() => {
          this._repoList = getEmptyCollection();
          this._repoCount = 0;
          this._repoListStatus = FetchStatus.REJECTED;
          this._lastPage = 0;
        });
      });
  };

  addRepos = ({ org, types }: AddReposProps) => {
    const requestRepoList = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page: this._lastPage + 1,
          per_page: this._pageLimit,
          type: types,
        },
      })
      .then(({ data }) => data.map((repo) => normalizeRepo(repo)));

    const requestRepoCount = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page: 1,
          per_page: 1,
          type: types,
        },
      })
      .then((resp) => getResponseItemCount(resp));

    Promise.all([requestRepoList, requestRepoCount])
      .then(([repoList, repoCount]) => {
        runInAction(() => {
          this._repoList = expandCollection(this._repoList, repoList, 'id');
          this._repoCount = repoCount;
          this._repoListStatus = FetchStatus.FULFILLED;
          this._lastPage++;
        });
      })
      .catch(() => {
        runInAction(() => {
          this._repoListStatus = FetchStatus.REJECTED;
          this._lastPage = 0;
        });
      });
  };

  resetRepoList = () => {
    this._repoList = getEmptyCollection();
    this._repoListStatus = FetchStatus.IDLE;
    this._repoCount = 0;
  };

  setPageLimit = (n: number) => {
    this._pageLimit = n;
  };

  destroy = () => undefined;
}

export default RepoListStore;
