import { makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import CollectionStore from 'store/CollectionStore';
import FetchStatusStore from 'store/FetchStatusStore';
import PaginationStore from 'store/PaginationStore';
import { RepoModel, RepoApi, normalizeRepo } from 'store/models/RepoListStore';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { getResponseItemCount } from 'utils/getResponseItemCount';
import { ILocalStore } from 'utils/hooks/useLocalStore';
import { AddReposProps, GetRepoListProps } from './RepoListStore.types';

export interface IRepoListStore {
  list: CollectionStore<number, RepoModel>;
  status: FetchStatusStore;
  pagination: PaginationStore;
}

class RepoListStore implements IRepoListStore, ILocalStore {
  list: CollectionStore<number, RepoModel> = new CollectionStore<number, RepoModel>([], 'id');
  status: FetchStatusStore = new FetchStatusStore();
  pagination: PaginationStore = new PaginationStore(9);

  constructor(props: GetRepoListProps) {
    makeObservable(this, {
      pagination: observable,
      addRepos: false,
      list: observable,
      status: observable,
      destroy: false,
      getRepoList: false,
      resetRepoList: false,
    });

    this.getRepoList(props);
  }

  getRepoList({ org, page = 1, types }: GetRepoListProps) {
    this.status.set(FetchStatus.PENDGING);
    this.pagination.setPage(page);

    const requestRepoList = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page,
          per_page: this.pagination.pageLimit,
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
          this.list.set(repoList);
          this.pagination.setItemCount(repoCount);
          this.status.set(FetchStatus.FULFILLED);
          this.pagination.setLastPage(1);
        });
      })
      .catch(() => {
        runInAction(() => {
          this.list.set([]);
          this.status.set(FetchStatus.REJECTED);
          this.pagination.setLastPage(page);
        });
      });
  }

  addRepos({ org, types }: AddReposProps) {
    const requestRepoList = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(org).REPOS, {
        params: {
          page: this.pagination.lastPage + 1,
          per_page: this.pagination.pageLimit,
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
          this.list.expand(repoList);
          this.pagination.setItemCount(repoCount);
          this.status.set(FetchStatus.FULFILLED);
          this.pagination.incrementLastPage();
        });
      })
      .catch(() => {
        runInAction(() => {
          this.status.set(FetchStatus.REJECTED);
          this.pagination.setLastPage(0);
        });
      });
  }

  resetRepoList() {
    this.list.set([]);
    this.status.set(FetchStatus.IDLE);
    this.pagination.setItemCount(0);
    this.pagination.setPage(1);
    this.pagination.setLastPage(1);
  }

  destroy = () => undefined;
}

export default RepoListStore;
