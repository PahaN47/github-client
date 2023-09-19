import * as qs from 'qs';

export type QueryParamNormailzer<T> = (param: qs.ParsedQs[keyof qs.ParsedQs]) => T;

export type QueryParamNormalizerObject<T> = {
  [K in keyof T]: QueryParamNormailzer<T[K]> | QueryParamNormalizerObject<T[K]>;
};

export type QueryNormalizer<T extends Record<string, unknown>> = (params: qs.ParsedQs | null) => T;

export const normalizeQuery =
  <T extends Record<string, unknown>>(normalizer: QueryParamNormalizerObject<T>): QueryNormalizer<T> =>
  (params) => {
    const result = {} as T;
    Object.keys(normalizer).forEach((key) => {
      if (typeof normalizer[key] === 'function') {
        result[key as keyof T] = (normalizer[key] as QueryParamNormailzer<T[keyof T]>)(params?.[key]);
      } else {
        result[key as keyof T] = normalizeQuery(normalizer[key] as QueryParamNormalizerObject<T[keyof T]>)(
          params?.[key] as qs.ParsedQs,
        ) as T[keyof T];
      }
    });

    return result;
  };
