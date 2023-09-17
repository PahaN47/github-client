import React, { useCallback } from 'react';
import Card from 'components/Card';
import CardCaption from '../CardCaption';

export type RepoCardProps = {
  className?: string;
  avatar: string;
  description: string;
  name: string;
  onClick: (name: string) => void;
  stargazersCount: number;
  updatedAt: string;
};

const RepoCard: React.FC<RepoCardProps> = ({
  className,
  avatar,
  description,
  name,
  onClick,
  stargazersCount,
  updatedAt,
}) => {
  const handleClick = useCallback(() => {
    onClick(name);
  }, [name, onClick]);

  return (
    <Card
      className={className}
      image={avatar}
      captionSlot={<CardCaption stargazersCount={stargazersCount} updatedAt={updatedAt} />}
      title={name}
      subtitle={description}
      onClick={handleClick}
    />
  );
};

export default RepoCard;
