import { useContext, useMemo, useRef } from 'react';
import { RootStoreContext } from 'store/RootStore';
import QueryStore, { UnparsedQueryParams, QueryParams } from 'store/RootStore/QueryStore';

export type QueryParamsParser<T extends QueryParams> = (params: UnparsedQueryParams<T> | null) => T;

export const useQuery = <T extends QueryParams>(parser: QueryParamsParser<T>): T => {
  const parserRef = useRef<QueryParamsParser<T> | null>(null);
  const { params } = useContext(RootStoreContext).query as QueryStore<T>;

  if (!parserRef.current) {
    parserRef.current = parser;
  }

  const parsedParams = useMemo(() => parserRef.current?.(params) as T, [params]);

  return parsedParams;
};
