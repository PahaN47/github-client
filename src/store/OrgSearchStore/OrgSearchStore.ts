import { makeObservable, observable, runInAction } from 'mobx';
import { debounce } from 'throttle-debounce';
import { API_ENDPOINTS } from 'config/api';
import { OrgsApi, normalizeOrgs } from 'store/models/OrgSearchStore';
import { axiosInstance } from 'utils/axios';
import { ILocalStore } from 'utils/hooks';

type PrivateFields = '_updateOptions';

class OrgSearchStore implements ILocalStore {
  options?: string[] = undefined;
  updateOptions: debounce<(search: string) => void>;

  constructor(delay: number = 500) {
    this.updateOptions = debounce(delay, this._updateOptions);
    makeObservable<this, PrivateFields>(this, {
      _updateOptions: false,
      destroy: false,
      options: observable.ref,
      updateOptions: false,
    });
  }

  private async _updateOptions(search: string) {
    runInAction(() => {
      this.options = undefined;
    });

    if (!search) {
      return;
    }

    await axiosInstance
      .get<OrgsApi>(API_ENDPOINTS.SEARCH_ORG(search), {
        params: {
          per_page: 5,
        },
      })
      .then(({ data }) => {
        runInAction(() => {
          this.options = normalizeOrgs(data);
        });
      });
  }

  destroy() {
    return;
  }
}

export default OrgSearchStore;
