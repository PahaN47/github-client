import { Base64 } from 'js-base64';
import { makeAutoObservable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import { FetchStatus } from 'store/types';
import axiosInstance from 'utils/axios';
import {
  Contributor,
  CurrentRepo,
  GetCurrentRepoProps,
  GetRepoListProps,
  Readme,
  Repo,
  RepoOwner,
} from './RepoStore.types';

export interface RepoStoreType {
  repoList: Repo[];
  repoListStatus: FetchStatus;
  pageLimit?: number;
  repoCount?: number;
  currentRepo?: CurrentRepo;
  currentRepoStatus: FetchStatus;
}

export const repoStoreInitialValue: RepoStoreType = {
  repoList: [],
  repoListStatus: FetchStatus.IDLE,
  pageLimit: 9,
  repoCount: 0,
  currentRepoStatus: FetchStatus.IDLE,
};

class RepoStore implements RepoStoreType {
  repoList: Repo[];
  repoListStatus: FetchStatus;
  pageLimit: number;
  repoCount: number;
  currentRepo?: CurrentRepo;
  currentRepoStatus: FetchStatus;

  constructor({ repoList, repoListStatus, pageLimit = 9, repoCount = 0, currentRepoStatus }: RepoStoreType) {
    this.repoList = repoList;
    this.repoListStatus = repoListStatus;
    this.pageLimit = pageLimit;
    this.repoCount = repoCount;
    this.currentRepoStatus = currentRepoStatus;

    makeAutoObservable(this);
  }

  private setRepoList = (repoList: Repo[]) => {
    this.repoList = repoList;
  };

  private setRepoListStatus = (status: FetchStatus) => {
    this.repoListStatus = status;
  };

  private setRepoCount = (repoCount: number) => {
    this.repoCount = repoCount;
  };

  private setCurrentRepo = (repo?: CurrentRepo) => {
    this.currentRepo = repo;
  };

  private setCurrentRepoStatus = (status: FetchStatus) => {
    this.currentRepoStatus = status;
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

  getCurrentRepo = async ({ owner, name }: GetCurrentRepoProps) => {
    this.setCurrentRepoStatus(FetchStatus.PENDGING);

    try {
      const currentRepo = (await axiosInstance.get<CurrentRepo>(API_ENDPOINTS.REPO(owner, name).index)).data;

      const requestLanguages = axiosInstance
        .get<Record<string, number>>(currentRepo.languages_url)
        .then(({ data }) => data);

      const requestContributors = axiosInstance
        .get<Omit<Contributor[], 'name'>>(currentRepo.contributors_url)
        .then(async ({ data }) => {
          const contributorList: Contributor[] = [];
          for (const { login } of data) {
            const fullUser = (await axiosInstance.get<Contributor>(API_ENDPOINTS.USER(login))).data;
            contributorList.push(fullUser);
          }
          return contributorList;
        });

      const requestReadme = axiosInstance
        .get<Readme>(API_ENDPOINTS.REPO(owner, name).README)
        .then(async ({ data }) => Base64.decode(data.content));

      await Promise.allSettled([requestLanguages, requestContributors, requestReadme])
        .then(([languages, contributors, readme]) => {
          runInAction(() => {
            (currentRepo as CurrentRepo).languages = languages.status === 'fulfilled' ? languages.value : {};

            (currentRepo as CurrentRepo).contributors = contributors.status === 'fulfilled' ? contributors.value : [];
            (currentRepo as CurrentRepo).readme = readme.status === 'fulfilled' ? readme.value : undefined;
          });

          return currentRepo;
        })
        .then((repo) => {
          if (repo) {
            this.setCurrentRepo(repo);
            this.setCurrentRepoStatus(FetchStatus.FULFILLED);
          }
        });
    } catch {
      this.setCurrentRepo(undefined);
      this.setCurrentRepoStatus(FetchStatus.REJECTED);
      return;
    }
  };

  resetCurrentRepo = () => {
    this.currentRepo = undefined;
    this.currentRepoStatus = FetchStatus.IDLE;
  };
}

export default RepoStore;
