import { useRootStore } from 'store/RootStore';

export const useWindowSize = () => {
  const windowSize = useRootStore().windowSize;
  return windowSize;
};
