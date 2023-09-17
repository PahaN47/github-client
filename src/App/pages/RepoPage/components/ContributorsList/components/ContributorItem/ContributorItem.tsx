import classNames from 'classnames';
import React, { memo } from 'react';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import cn from './ContributorItem.module.scss';

export type ContributorItemProps = {
  className?: string;
  avatarUrl: string;
  login: string;
  name: string;
};

const ContributorItem: React.FC<ContributorItemProps> = memo(({ className, avatarUrl, login, name }) => (
  <div className={classNames(className, cn['wrap'])}>
    <Avatar src={avatarUrl} />
    <Text view="p-16" color="secondary">
      <b>{login} </b>
      {name}
    </Text>
  </div>
));

ContributorItem.displayName = 'ContributorItem';

export default ContributorItem;
