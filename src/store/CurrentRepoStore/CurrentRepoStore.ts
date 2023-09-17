import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import {
  ContributorApi,
  ContributorModel,
  CurrentRepoApi,
  CurrentRepoModel,
  LanguagesApi,
  normalizeContributor,
  normalizeCurrentRepo,
  normalizeLanguages,
  normalizeReadme,
  ReadmeApi,
} from 'store/models/CurrentRepoStore';
import { normalizeCollection } from 'store/models/shared';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { getResponseItemCount } from 'utils/getResponseItemCount';
import { ILocalStore } from 'utils/hooks/useLocalStore';
import { GetCurrentRepoProps } from './CurrentRepoStore.types';

export interface ICurrentRepoStore {
  currentRepo?: CurrentRepoModel;
  currentRepoStatus: FetchStatus;
}

type PrivateFields = '_currentRepo' | '_currentRepoStatus';

class CurrentRepoStore implements ICurrentRepoStore, ILocalStore {
  private _currentRepo?: CurrentRepoModel = undefined;
  private _currentRepoStatus: FetchStatus = FetchStatus.IDLE;

  constructor() {
    makeObservable<CurrentRepoStore, PrivateFields>(this, {
      destroy: action,
      _currentRepoStatus: observable,
      _currentRepo: observable.ref,
      currentRepo: computed,
      currentRepoStatus: computed,
      getCurrentRepo: action,
      resetCurrentRepo: action,
    });
  }

  get currentRepo() {
    return this._currentRepo;
  }

  get currentRepoStatus() {
    return this._currentRepoStatus;
  }

  getCurrentRepo = async ({ owner, name }: GetCurrentRepoProps) => {
    this._currentRepoStatus = FetchStatus.PENDGING;

    try {
      const currentRepo = await axiosInstance
        .get<CurrentRepoApi>(API_ENDPOINTS.REPO(owner, name).index)
        .then(({ data }) => normalizeCurrentRepo(data));

      const requestLanguages = axiosInstance
        .get<LanguagesApi>(currentRepo.languagesUrl)
        .then(({ data }) => normalizeLanguages(data));

      const requestContributorsCount = axiosInstance
        .get<ContributorApi[]>(currentRepo.contributorsUrl, {
          params: { page: 1, per_page: 1 },
        })
        .then((resp) => getResponseItemCount(resp));

      const requestContributors = axiosInstance
        .get<ContributorApi[]>(currentRepo.contributorsUrl, { params: { page: 1, per_page: 10 } })
        .then(async ({ data }) => {
          const contributorList: ContributorModel[] = await Promise.all(
            data.map(({ login }) => axiosInstance.get<ContributorApi>(API_ENDPOINTS.USER(login))),
          ).then((res) => res.map(({ data }) => normalizeContributor(data)));

          return contributorList;
        });

      const requestReadme = axiosInstance
        .get<ReadmeApi>(API_ENDPOINTS.REPO(owner, name).README)
        .then(async ({ data }) => normalizeReadme(data));

      await Promise.allSettled([requestLanguages, requestContributorsCount, requestContributors, requestReadme])
        .then(([languages, contributorsCount, contributors, readme]) => {
          runInAction(() => {
            if (languages.status === 'fulfilled') {
              currentRepo.languages = normalizeCollection(languages.value, 'name');
            }
            if (contributorsCount.status === 'fulfilled') {
              currentRepo.contributorsCount = contributorsCount.value;
            }
            if (contributors.status === 'fulfilled') {
              currentRepo.contributors = normalizeCollection(contributors.value, 'id');
            }
            if (readme.status === 'fulfilled') {
              currentRepo.readme = readme.value;
            }
          });

          return currentRepo;
        })
        .then((repo) => {
          runInAction(() => {
            if (repo) {
              this._currentRepo = repo;
              this._currentRepoStatus = FetchStatus.FULFILLED;
            }
          });
        });
    } catch {
      runInAction(() => {
        this._currentRepo = undefined;
        this._currentRepoStatus = FetchStatus.REJECTED;
      });
      return;
    }
  };

  resetCurrentRepo = () => {
    this._currentRepo = undefined;
    this._currentRepoStatus = FetchStatus.IDLE;
  };

  destroy = () => undefined;
}

export default CurrentRepoStore;
