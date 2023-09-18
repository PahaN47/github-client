import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { RootStoreContext } from 'store/RootStore';

export const useQueryStoreInit = () => {
  const { search } = useLocation();
  const { setQueryString } = useContext(RootStoreContext).query;

  setQueryString(search);
};
