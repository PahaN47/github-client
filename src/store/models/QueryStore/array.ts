import { QueryParamNormailzer } from './query';

export const arrayQuery =
  <T>(normalizer: QueryParamNormailzer<T>, defaultValue: T[] = []): QueryParamNormailzer<T[]> =>
  (param) => {
    if (Array.isArray(param)) {
      return param.map(normalizer);
    }
    if (param) {
      return [normalizer(param)];
    }
    return defaultValue;
  };
