import { QueryParamNormailzer } from './query';

export const stringQuery =
  <T extends string = string>(defaultValue: string = ''): QueryParamNormailzer<T> =>
  (param) => {
    return (typeof param === 'string' ? param : defaultValue) as T;
  };
