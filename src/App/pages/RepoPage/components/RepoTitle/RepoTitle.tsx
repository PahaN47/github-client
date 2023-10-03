import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Text from 'components/Text';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import cn from './RepoTitle.module.scss';

export type RepoTitleProps = {
  avatar: string;
  name: string;
};

const RepoTitle: React.FC<RepoTitleProps> = ({ avatar, name }) => {
  const navigate = useNavigate();

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={cn['wrap']}>
      <div className={cn['content']}>
        <ArrowLeftIcon className={cn['back']} onClick={handleBackClick} />
        <img className={cn['avatar']} src={avatar} />
      </div>
      <Text className={cn['title']} view="title" color="primary" tag="p">
        {name}
      </Text>
    </div>
  );
};

export default RepoTitle;
