import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import FetchStatusStore from 'store/FetchStatusStore';
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
  isIdle: boolean;
  isPending: boolean;
  isFulfilled: boolean;
  isRejected: boolean;
}

type PrivateFields = '_currentRepo' | '_currentRepoStatus';

class CurrentRepoStore implements ICurrentRepoStore, ILocalStore {
  private _currentRepo?: CurrentRepoModel = undefined;
  private _currentRepoStatus: FetchStatusStore = new FetchStatusStore();

  constructor(props: GetCurrentRepoProps) {
    makeObservable<CurrentRepoStore, PrivateFields>(this, {
      isFulfilled: computed,
      isRejected: computed,
      isPending: computed,
      isIdle: computed,
      destroy: false,
      _currentRepoStatus: observable,
      _currentRepo: observable.ref,
      currentRepo: computed,
      getCurrentRepo: false,
      resetCurrentRepo: action.bound,
    });

    this.getCurrentRepo(props);
  }

  get currentRepo() {
    return this._currentRepo;
  }

  get isIdle() {
    return this._currentRepoStatus.isIdle;
  }

  get isPending() {
    return this._currentRepoStatus.isPending;
  }

  get isFulfilled() {
    return this._currentRepoStatus.isFulfilled;
  }

  get isRejected() {
    return this._currentRepoStatus.isRejected;
  }

  getCurrentRepo = async ({ owner, name }: GetCurrentRepoProps) => {
    runInAction(() => this._currentRepoStatus.setStatus(FetchStatus.PENDGING));

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
              this._currentRepoStatus.setStatus(FetchStatus.FULFILLED);
            }
          });
        });
    } catch {
      runInAction(() => {
        this._currentRepo = undefined;
        this._currentRepoStatus.setStatus(FetchStatus.REJECTED);
      });
      return;
    }
  };

  resetCurrentRepo() {
    this._currentRepo = undefined;
    this._currentRepoStatus.setStatus(FetchStatus.IDLE);
  }

  destroy() {
    return;
  }
}

export default CurrentRepoStore;
