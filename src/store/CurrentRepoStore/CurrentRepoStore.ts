import { Base64 } from 'js-base64';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import { FetchStatus } from 'store/types';
import axiosInstance from 'utils/axios';
import getParsedLanguages from 'utils/getParsedLanguages';
import { Contributor, CurrentRepo, GetCurrentRepoProps, Readme } from './CurrentRepoStore.types';

export interface CurrentRepoStoreType {
  currentRepo?: CurrentRepo;
  currentRepoStatus: FetchStatus;
}

export const currentRepoStoreInitialValue: CurrentRepoStoreType = {
  currentRepoStatus: FetchStatus.IDLE,
};

class CurrentRepoStore implements CurrentRepoStoreType {
  currentRepo?: CurrentRepo;
  currentRepoStatus: FetchStatus;

  constructor({ currentRepoStatus }: CurrentRepoStoreType) {
    this.currentRepoStatus = currentRepoStatus;

    makeObservable(this, {
      currentRepo: observable,
      currentRepoStatus: observable,
      setCurrentRepo: action,
      setCurrentRepoStatus: action,
      getCurrentRepo: action,
      resetCurrentRepo: action,
    });
  }

  setCurrentRepo = (repo?: CurrentRepo) => {
    this.currentRepo = repo;
  };

  setCurrentRepoStatus = (status: FetchStatus) => {
    this.currentRepoStatus = status;
  };

  getCurrentRepo = async ({ owner, name }: GetCurrentRepoProps) => {
    this.setCurrentRepoStatus(FetchStatus.PENDGING);

    try {
      const currentRepo = (await axiosInstance.get<CurrentRepo>(API_ENDPOINTS.REPO(owner, name).index)).data;

      const requestLanguages = axiosInstance
        .get<Record<string, number>>(currentRepo.languages_url)
        .then(({ data }) => getParsedLanguages(data));

      const requestContributorsCount = axiosInstance
        .get<Contributor[]>(currentRepo.contributors_url, {
          params: { page: 1, per_page: 1 },
        })
        .then(({ headers, data }) => data.length && +[...headers.link.matchAll(/[^_]page=(\d+)/g)][1][1]);

      const requestContributors = axiosInstance
        .get<Omit<Contributor[], 'name'>>(currentRepo.contributors_url, { params: { page: 1, per_page: 10 } })
        .then(async ({ data }) => {
          const contributorList: Contributor[] = await Promise.all(
            data.map(({ login }) => axiosInstance.get<Contributor>(API_ENDPOINTS.USER(login))),
          ).then((res) => res.map(({ data }) => data));

          return contributorList;
        });

      const requestReadme = axiosInstance
        .get<Readme>(API_ENDPOINTS.REPO(owner, name).README)
        .then(async ({ data }) => Base64.decode(data.content));

      await Promise.allSettled([requestLanguages, requestContributorsCount, requestContributors, requestReadme])
        .then(([languages, contributorsCount, contributors, readme]) => {
          runInAction(() => {
            currentRepo.languages = languages.status === 'fulfilled' ? languages.value : [];
            currentRepo.contributorsCount = contributorsCount.status === 'fulfilled' ? contributorsCount.value : 0;
            currentRepo.contributors = contributors.status === 'fulfilled' ? contributors.value : [];
            currentRepo.readme = readme.status === 'fulfilled' ? readme.value : undefined;
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

export default CurrentRepoStore;
