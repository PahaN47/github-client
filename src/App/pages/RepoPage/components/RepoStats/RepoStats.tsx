import React from 'react';
import Text from 'components/Text';
import EyeIcon from 'components/icons/EyeIcon';
import ForkIcon from 'components/icons/ForkIcon';
import StarIcon from 'components/icons/StarIcon';
import cn from './RepoStats.module.scss';

export type RepoStatsProps = {
  stars: number;
  watching: number;
  forks: number;
};

const RepoStats: React.FC<RepoStatsProps> = ({ stars, watching, forks }) => (
  <div className={cn['wrap']}>
    <StarIcon />
    <Text view="p-14">
      <b>{stars}</b> stars
    </Text>
    <EyeIcon />
    <Text view="p-14">
      <b>{watching}</b> watching
    </Text>
    <ForkIcon />
    <Text view="p-14">
      <b>{forks}</b> forks
    </Text>
  </div>
);

export default RepoStats;
