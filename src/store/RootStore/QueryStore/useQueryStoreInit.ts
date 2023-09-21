import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RootStoreContext } from 'store/RootStore';

export const useQueryStoreInit = () => {
  const queryStore = useContext(RootStoreContext).query;
  const { search } = useLocation();

  useEffect(() => {
    queryStore.setQueryString(search);
  }, [search]);
};
