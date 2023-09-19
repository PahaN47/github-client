import { useLocation } from 'react-router-dom';
import rootStore from 'store/RootStore';

export const useQueryStoreInit = () => {
  const { search } = useLocation();
  const queryStore = rootStore.query;

  queryStore.setQueryString(search);
};
