import { action, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import CollectionStore from 'store/CollectionStore';
import FetchStatusStore from 'store/FetchStatusStore';
import PaginationStore from 'store/PaginationStore';
import QSConnector from 'store/QSConnector';
import type QueryStore from 'store/RootStore/QueryStore';
import { arrayQuery, numberQuery, stringQuery } from 'store/models/QueryStore';
import { RepoModel, RepoApi, normalizeRepo } from 'store/models/RepoListStore';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { getResponseItemCount } from 'utils/getResponseItemCount';
import { ILocalStore } from 'utils/hooks/useLocalStore';
import { AddReposProps, RepoType } from './RepoListStore.types';

export interface IRepoListStore {
  list: CollectionStore<number, RepoModel>;
  status: FetchStatusStore;
  pagination: PaginationStore;
}

class RepoListStore implements IRepoListStore, ILocalStore {
  org: string;
  types: RepoType[] = [];

  readonly list = new CollectionStore<number, RepoModel>([], 'id');
  readonly status = new FetchStatusStore();
  readonly pagination = new PaginationStore(9);

  private readonly pageQP: QSConnector<number>;
  private readonly typeQP: QSConnector<RepoType[]>;

  constructor(org: string, queryStore: QueryStore) {
    this.org = org;

    makeObservable(this, {
      org: observable,
      types: observable.ref,
      pagination: observable,
      addRepos: false,
      list: observable,
      status: observable,
      destroy: false,
      getRepoList: false,
      resetRepoList: false,
      setTypes: action.bound,
      setOrg: action.bound,
    });

    this.pageQP = new QSConnector(queryStore, {
      name: 'page',
      parser: numberQuery(1),
      watchValue: () => this.pagination.page,
    });
    this.typeQP = new QSConnector(queryStore, {
      name: 'type',
      parser: arrayQuery(stringQuery<RepoType>()),
      watchValue: () => this.types,
    });

    this.pagination.setPage(this.pageQP.value);
    this.types = this.typeQP.value;

    this.getRepoList();
  }

  setTypes(types: RepoType[]) {
    this.types = types;
  }

  setOrg(value: string) {
    this.org = value;
  }

  getRepoList() {
    this.status.set(FetchStatus.PENDGING);
    this.pagination.setPage(this.pagination.page);

    const requestRepoList = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(this.org).REPOS, {
        params: {
          page: this.pagination.page,
          per_page: this.pagination.pageLimit,
          type: this.types,
        },
      })
      .then(({ data }) => data.map((repo) => normalizeRepo(repo)));

    const requestRepoCount = axiosInstance
      .get<RepoApi[]>(API_ENDPOINTS.ORG(this.org).REPOS, {
        params: {
          page: 1,
          per_page: 1,
          type: this.types,
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
          this.pagination.setLastPage(this.pagination.page);
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

  destroy = () => {
    this.pageQP.destroy();
    this.typeQP.destroy();
  };
}

export default RepoListStore;
