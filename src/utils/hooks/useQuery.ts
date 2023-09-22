import { useContext } from 'react';
import ParsedQueryStore from 'store/ParsedQueryStore';
import { RootStoreContext } from 'store/RootStore';
import { QueryParamNormalizerObject } from 'store/models/QueryStore';
import { DeepPartial } from 'store/types';
import { useLocalStore } from 'utils/hooks';

// оставил, потому что раз мы передаем ему глобальный стор в параметры все равно, то лучше один хук, чем два
export const useQuery = <T extends Record<string, unknown>>(
  parserObject: QueryParamNormalizerObject<T>,
): [T, (params: DeepPartial<T>, replace?: boolean) => void] => {
  const queryStore = useContext(RootStoreContext).query;
  const parsedQueryStore = useLocalStore(() => new ParsedQueryStore(queryStore, parserObject));

  return [parsedQueryStore.params, parsedQueryStore.setQuery];
};
