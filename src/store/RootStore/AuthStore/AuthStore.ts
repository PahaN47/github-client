import axios from 'axios';
import { IReactionDisposer, action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import * as qs from 'qs';
import { API_ENDPOINTS } from 'config/api';
import { localStorageKeys } from 'config/localStorage';
import FetchStatusStore from 'store/FetchStatusStore';
import QueryStore from 'store/RootStore/QueryStore';
import { AuthUserApi, AuthUserModel, normalizeAuthUser } from 'store/models/AuthStore';
import { FetchStatus } from 'store/types';
import { axiosInstance } from 'utils/axios';
import { ILocalStore } from 'utils/hooks';

type PrivateFields =
  | '_queryStore'
  | '_codeReaction'
  | '_tokenReaction'
  | '_watchCode'
  | '_watchToken'
  | '_userAccessToken';

class AuthStore implements ILocalStore {
  private _queryStore: QueryStore;
  private _codeReaction: IReactionDisposer;
  private _tokenReaction: IReactionDisposer;
  private _userAccessToken?: string = undefined;
  authUrl: string = API_ENDPOINTS.LOGIN(process.env.CLIENT_ID);
  user?: AuthUserModel;
  status: FetchStatusStore = new FetchStatusStore();

  constructor(queryStore: QueryStore) {
    makeObservable<this, PrivateFields>(this, {
      logout: action.bound,
      status: false,
      isAuth: computed,
      user: observable.ref,
      authUrl: false,
      _watchToken: false,
      _tokenReaction: false,
      _userAccessToken: observable,
      destroy: false,
      _watchCode: false,
      _codeReaction: false,
      _queryStore: false,
    });

    this._queryStore = queryStore;
    this._userAccessToken = localStorage.getItem(localStorageKeys.USER_TOKEN) ?? undefined;
    this._codeReaction = reaction(() => this._queryStore.params, this._watchCode.bind(this), { fireImmediately: true });
    this._tokenReaction = reaction(() => this._userAccessToken, this._watchToken.bind(this), { fireImmediately: true });
  }

  private _watchCode(params: qs.ParsedQs | null) {
    const code = params?.code;
    if (this._userAccessToken || typeof code !== 'string') {
      return;
    }

    this.status.set(FetchStatus.PENDING);

    axios
      .get<{ token: string }>(API_ENDPOINTS.AUTH(code))
      .then(({ data }) => {
        localStorage.setItem(localStorageKeys.USER_TOKEN, data.token);
        runInAction(() => {
          this._userAccessToken = data.token;
        });
      })
      .catch(() => {
        this.status.set(FetchStatus.REJECTED);
      });
  }

  private _watchToken(token?: string) {
    if (!token) {
      return;
    }

    this.status.set(FetchStatus.PENDING);

    axiosInstance
      .get<AuthUserApi>(API_ENDPOINTS.AUTH_USER)
      .then(({ data }) => {
        runInAction(() => {
          this.user = normalizeAuthUser(data);
          this.status.set(FetchStatus.FULFILLED);
        });
      })
      .catch(() => {
        this.status.set(FetchStatus.REJECTED);
      });
  }

  get isAuth() {
    return !!this.user;
  }

  logout() {
    localStorage.removeItem(localStorageKeys.USER_TOKEN);
    this._userAccessToken = undefined;
    this.user = undefined;
    this.status.set(FetchStatus.IDLE);
  }

  destroy() {
    this._codeReaction();
    this._tokenReaction();
  }
}
export default AuthStore;
