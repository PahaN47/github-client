import { useLocation } from 'react-router-dom';
import ParsedQueryStore from 'store/ParsedQueryStore';
import { QueryParamNormalizerObject } from 'store/models/QueryStore';
import { useLocalStore } from 'utils/hooks';

export const useQuery = <T extends Record<string, unknown>>(parserObject: QueryParamNormalizerObject<T>): T => {
  const { search } = useLocation();
  const parsedQueryStore = useLocalStore(() => new ParsedQueryStore(search, parserObject));

  return parsedQueryStore.params;
};
