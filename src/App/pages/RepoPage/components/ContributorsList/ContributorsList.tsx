import classNames from 'classnames';
import React from 'react';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import { Contributor } from 'store/RepoStore/RepoStore.types';
import cn from './ContributorsList.module.scss';

export type ContributorsListProps = {
  className?: string;
  list: Contributor[];
};

const ContributorsList: React.FC<ContributorsListProps> = ({ className, list }) => (
  <div className={classNames(className, cn['wrap'])}>
    <div className={cn['title']}>
      <Text view="p-18" weight="bold" color="primary" tag="p">
        Contributors
        <span className={cn['tag']} data-count={list.length} />
      </Text>
    </div>
    {list.map(({ id, avatar_url, login, name }) => (
      <div key={id} className={cn['user-wrap']}>
        <Avatar src={avatar_url} />
        <Text view="p-16" color="secondary">
          <b>{login} </b>
          {name}
        </Text>
      </div>
    ))}
  </div>
);

export default ContributorsList;
