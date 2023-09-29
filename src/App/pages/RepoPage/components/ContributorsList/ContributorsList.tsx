import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import { ContributorModel } from 'store/models/CurrentRepoStore';
import ContributorItem from './components/ContributorItem';
import cn from './ContributorsList.module.scss';

export type ContributorsListProps = {
  className?: string;
  list: ContributorModel[];
  count: number;
};

const ContributorsList: React.FC<ContributorsListProps> = ({ className, list, count }) => (
  <div className={classNames(className, cn['wrap'])}>
    <div className={cn['title']}>
      <Text view="p-18" weight="bold" color="primary" tag="p">
        Contributors
        <span className={cn['tag']} data-count={count} />
      </Text>
    </div>
    {list.map((item) => (
      <ContributorItem key={item.id} {...item} />
    ))}
  </div>
);

export default ContributorsList;
