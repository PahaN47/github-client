import * as qs from 'qs';

export const getQueryString = <T extends Record<string, unknown>>(query: T | null) =>
  qs.stringify(query, { indices: false });
