import { QueryParamNormailzer } from './query';

export const numberQuery =
  (defaultValue: number = 0): QueryParamNormailzer<number> =>
  (param) => {
    return +(param ?? defaultValue) || defaultValue;
  };
