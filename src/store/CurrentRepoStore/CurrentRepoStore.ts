import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { API_ENDPOINTS } from 'config/api';
import FetchStatusStore from 'store/FetchStatusStore';
import {
  ContributorApi,
  CurrentRepoApi,
  CurrentRepoModel,
  LanguagesApi,
  normalizeContributor,
  normalizeCurrentRepo,
  normalizeLanguages,
  normalizeReadme,
  ReadmeApi,
} from 'store/models/CurrentRepoStore';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { getResponseItemCount } from 'utils/getResponseItemCount';
import { ILocalStore } from 'utils/hooks/useLocalStore';
import { GetCurrentRepoProps } from './CurrentRepoStore.types';

export interface ICurrentRepoStore {
  currentRepo?: CurrentRepoModel;
}

type PrivateFields = '_currentRepo';

class CurrentRepoStore implements ICurrentRepoStore, ILocalStore {
  private _currentRepo?: CurrentRepoModel = undefined;
  status: FetchStatusStore = new FetchStatusStore();

  constructor(props: GetCurrentRepoProps) {
    makeObservable<CurrentRepoStore, PrivateFields>(this, {
      destroy: false,
      status: observable,
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

  getCurrentRepo = async ({ owner, name }: GetCurrentRepoProps) => {
    runInAction(() => this.status.set(FetchStatus.PENDGING));

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
        .then(({ data }) =>
          Promise.all(data.map(({ login }) => axiosInstance.get<ContributorApi>(API_ENDPOINTS.USER(login)))).then(
            (res) => res.map(({ data }) => normalizeContributor(data)),
          ),
        );

      const requestReadme = axiosInstance
        .get<ReadmeApi>(API_ENDPOINTS.REPO(owner, name).README)
        .then(async ({ data }) => normalizeReadme(data));

      Promise.allSettled([requestLanguages, requestContributorsCount, requestContributors, requestReadme])
        .then(([languages, contributorsCount, contributors, readme]) => {
          runInAction(() => {
            if (languages.status === 'fulfilled') {
              currentRepo.languages.set(languages.value);
            }
            if (contributorsCount.status === 'fulfilled') {
              currentRepo.contributorsCount = contributorsCount.value;
            }
            if (contributors.status === 'fulfilled') {
              currentRepo.contributors.set(contributors.value);
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
              this.status.set(FetchStatus.FULFILLED);
            }
          });
        });
    } catch {
      runInAction(() => {
        this._currentRepo = undefined;
        this.status.set(FetchStatus.REJECTED);
      });
      return;
    }
  };

  resetCurrentRepo() {
    this._currentRepo = undefined;
    this.status.set(FetchStatus.IDLE);
  }

  destroy() {
    return;
  }
}

export default CurrentRepoStore;
