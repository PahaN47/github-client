import React from 'react';
import EyeIcon from 'components/icons/EyeIcon';
import ForkIcon from 'components/icons/ForkIcon';
import StarIcon from 'components/icons/StarIcon';
import RepoStat from './components/RepoStat';
import cn from './RepoStats.module.scss';

export type RepoStatsProps = {
  stars: number;
  watching: number;
  forks: number;
};

const RepoStats: React.FC<RepoStatsProps> = ({ stars, watching, forks }) => (
  <div className={cn['wrap']}>
    <RepoStat icon={<StarIcon />} count={stars}>
      stars
    </RepoStat>
    <RepoStat icon={<EyeIcon />} count={watching}>
      watching
    </RepoStat>
    <RepoStat icon={<ForkIcon />} count={forks}>
      forks
    </RepoStat>
  </div>
);

export default RepoStats;
