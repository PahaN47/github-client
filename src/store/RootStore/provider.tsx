import React from 'react';
import RootStore from './RootStore';

export const RootStoreContext = React.createContext(null as unknown as RootStore);

const RootStoreProvider = ({ children }: React.PropsWithChildren) => (
  <RootStoreContext.Provider value={new RootStore()}>{children}</RootStoreContext.Provider>
);

export default RootStoreProvider;
