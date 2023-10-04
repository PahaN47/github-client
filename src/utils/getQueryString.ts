import * as qs from 'qs';

const filterEmptyKeys = <T extends object>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;

export const getQueryString = <T extends Record<string, unknown>>(query: T | null) =>
  qs.stringify(query ? filterEmptyKeys(query) : query, { indices: false });
