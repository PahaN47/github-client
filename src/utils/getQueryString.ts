import * as qs from 'qs';
import { QueryParams } from 'store/RootStore/QueryStore';

export const getQueryString = <T extends QueryParams>(query: T | null) => qs.stringify(query, { indices: false });
