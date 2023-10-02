import { useContext } from 'react';
import { RootStoreContext } from 'store/RootStore';

export const useAuth = () => {
  return useContext(RootStoreContext).auth;
};
