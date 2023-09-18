import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RootStoreContext } from 'store/RootStore';

export const useQueryStoreInit = () => {
  const { search } = useLocation();
  const { setQueryString } = useContext(RootStoreContext).query;
  const [shouldUpdateQuery, setShouldUpdateQuery] = useState(true);

  useEffect(
    () => {
      setShouldUpdateQuery(true);
    },
    () => setShouldUpdateQuery(false),
    [],
  );

  if (shouldUpdateQuery) {
    setQueryString(search);
  }
};
