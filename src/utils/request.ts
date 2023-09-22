import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import HTTPMethod from 'http-method-enum';
import { axiosInstance } from './axios';

export type RequestProps =
  | {
      method: HTTPMethod.POST | HTTPMethod.PUT | HTTPMethod.PATCH;
      data?: unknown;
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    }
  | {
      method: HTTPMethod.DELETE | HTTPMethod.GET | HTTPMethod.HEAD | HTTPMethod.OPTIONS;
      data?: undefined;
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    };

export type Response<T> = {
  result?: AxiosResponse<T>;
  error?: AxiosError;
};

const getAxiosMethod = <T>(method?: HTTPMethod) => {
  switch (method) {
    case HTTPMethod.DELETE:
      return { func: axiosInstance.delete<T>, hasData: false };
    case HTTPMethod.HEAD:
      return { func: axiosInstance.head<T>, hasData: false };
    case HTTPMethod.OPTIONS:
      return { func: axiosInstance.options<T>, hasData: false };
    case HTTPMethod.PATCH:
      return { func: axiosInstance.patch<T>, hasData: true };
    case HTTPMethod.POST:
      return { func: axiosInstance.post<T>, hasData: true };
    case HTTPMethod.PUT:
      return { func: axiosInstance.put<T>, hasData: true };
    default:
      return { func: axiosInstance.get<T>, hasData: false };
  }
};

export const request = async <T = unknown>(path: string, props?: RequestProps): Promise<Response<T>> => {
  const method = props?.method;
  const data = props?.data;
  const params = props?.params;
  const headers = props?.headers;
  const { func, hasData } = getAxiosMethod<T>(method);
  try {
    const result = await (hasData ? func(path, data, { params, headers }) : func(path, { params, headers }));
    return {
      result,
    };
  } catch (e) {
    return {
      error: e as AxiosError,
    };
  }
};
