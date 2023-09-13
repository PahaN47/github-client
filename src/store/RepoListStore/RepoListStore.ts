import { action, makeObservable, observable } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import { FetchStatus } from 'store/types';
import axiosInstance from 'utils/axios';
import { GetRepoListProps, Repo, RepoOwner } from './RepoListStore.types';

export interface RepoListStoreType {
  repoList: Repo[];
  repoListStatus: FetchStatus;
  pageLimit?: number;
  repoCount?: number;
}

export const repoListStoreInitialValue: RepoListStoreType = {
  repoList: [],
  repoListStatus: FetchStatus.IDLE,
  pageLimit: 9,
  repoCount: 0,
};

class RepoListStore implements RepoListStoreType {
  repoList: Repo[];
  repoListStatus: FetchStatus;
  pageLimit: number;
  repoCount: number;

  constructor({ repoList, repoListStatus, pageLimit = 9, repoCount = 0 }: RepoListStoreType) {
    this.repoList = repoList;
    this.repoListStatus = repoListStatus;
    this.pageLimit = pageLimit;
    this.repoCount = repoCount;

    makeObservable(this, {
      repoList: observable,
      repoListStatus: observable,
      pageLimit: observable,
      repoCount: observable,
      setRepoList: action,
      setRepoListStatus: action,
      setRepoCount: action,
      getRepoList: action,
      resetRepoList: action,
      setPageLimit: action,
    });
  }

  setRepoList = (repoList: Repo[]) => {
    this.repoList = repoList;
  };

  setRepoListStatus = (status: FetchStatus) => {
    this.repoListStatus = status;
  };

  setRepoCount = (repoCount: number) => {
    this.repoCount = repoCount;
  };

  getRepoList = ({ org, page }: GetRepoListProps) => {
    this.setRepoListStatus(FetchStatus.PENDGING);

    const requestRepoList = axiosInstance.get<Repo[]>(API_ENDPOINTS.ORG(org).REPOS, {
      params: {
        page,
        per_page: this.pageLimit,
      },
    });

    requestRepoList
      .then(({ data }) => {
        if (this.repoList[0]?.owner?.login !== org) {
          const requestRepoCount = axiosInstance.get<RepoOwner>(API_ENDPOINTS.ORG(org).index);

          requestRepoCount
            .then(({ data }) => {
              this.setRepoCount(data.public_repos);
            })
            .catch((e) => {
              throw e;
            });
        }
        this.setRepoList(data);
        this.setRepoListStatus(FetchStatus.FULFILLED);
      })
      .catch(() => {
        this.setRepoList([]);
        this.setRepoCount(0);
        this.setRepoListStatus(FetchStatus.REJECTED);
      });
  };

  resetRepoList = () => {
    this.repoList = [];
    this.repoListStatus = FetchStatus.IDLE;
  };

  setPageLimit = (n: number) => {
    this.pageLimit = n;
  };
}

export default RepoListStore;
