import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'components/Text';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import cn from './RepoTitle.module.scss';

export type RepoTitleProps = {
  avatar: string;
  name: string;
};

const RepoTitle: React.FC<RepoTitleProps> = ({ avatar, name }) => (
  <div className={cn['wrap']}>
    <Link className={cn['link']} to="/repos">
      <ArrowLeftIcon />
    </Link>
    <img className={cn['avatar']} src={avatar} />
    <Text view="title" color="primary">
      {name}
    </Text>
  </div>
);

export default RepoTitle;
