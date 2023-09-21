import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import RootStore from './RootStore';

export const RootStoreContext = createContext<RootStore>(null as unknown as RootStore);

const RootStoreProvider = ({ children }: React.PropsWithChildren) => {
  const { search } = useLocation();

  const newStoreRef = useRef<RootStore | null>(null);
  if (!newStoreRef.current) {
    newStoreRef.current = new RootStore({ queryStoreProps: { initialQs: search } });
  }

  return <RootStoreContext.Provider value={newStoreRef.current}>{children}</RootStoreContext.Provider>;
};

export default RootStoreProvider;
