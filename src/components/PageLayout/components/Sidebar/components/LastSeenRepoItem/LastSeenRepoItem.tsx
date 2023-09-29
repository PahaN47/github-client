import classNames from 'classnames';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import StarIcon from 'components/icons/StarIcon';
import { LastSeenRepo } from 'store/models/LastSeenReposStore';
import cn from './LastSeenRepoItem.module.scss';

export type LastSeenRepoItemProps = LastSeenRepo & {
  className?: string;
  onClick?: () => void;
};

const LastSeenRepoItem: React.FC<LastSeenRepoItemProps> = ({ className, onClick, name, stargazersCount, owner }) => (
  <Link className={classNames(className, cn['wrap'])} to={`/repos/${owner.login}/${name}`} onClick={onClick}>
    <Avatar className={cn['avatar']} src={owner.avatarUrl} />
    <div className={cn['content']}>
      <Text view="p-18" weight="bold" maxLines={1}>
        {name}
      </Text>
      <Text className={cn['stars']} view="p-14" weight="medium" tag="div" color="secondary">
        <StarIcon color="default" />
        {stargazersCount}
      </Text>
    </div>
  </Link>
);

export default memo(LastSeenRepoItem);
