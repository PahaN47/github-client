import { QueryParamNormailzer } from './query';

export const booleanQuery =
  <T extends boolean | undefined>(defaultValue?: boolean | T): QueryParamNormailzer<boolean | T> =>
  (param) => {
    if (param === 'true') {
      return true;
    }

    if (param === 'false') {
      return false;
    }

    return defaultValue as boolean | T;
  };
