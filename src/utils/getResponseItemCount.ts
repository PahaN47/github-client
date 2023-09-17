import { AxiosResponse } from 'axios';

export const getResponseItemCount = ({ data, headers }: AxiosResponse<unknown[]>) =>
  data.length && +[...headers.link.matchAll(/[^_]page=(\d+)/g)][1][1];
