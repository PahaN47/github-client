import React from 'react';
import Text from 'components/Text';

export type RepoStatProps = {
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
};

const RepoStat: React.FC<RepoStatProps> = ({ icon, count, children }) => (
  <>
    {icon}
    <Text view="p-14">
      <b>{count}</b> {children}
    </Text>
  </>
);

export default RepoStat;
