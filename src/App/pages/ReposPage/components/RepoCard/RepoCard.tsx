import React from 'react';
import Card from 'components/Card';
import CardCaption from '../CardCaption';

export type RepoCardProps = {
  className?: string;
  avatar: string;
  description: string;
  name: string;
  stargazersCount: number;
  updatedAt: Date;
  link: string;
};

const RepoCard: React.FC<RepoCardProps> = ({
  className,
  avatar,
  description,
  name,
  stargazersCount,
  updatedAt,
  link,
}) => (
  <Card
    className={className}
    image={avatar}
    captionSlot={<CardCaption stargazersCount={stargazersCount} updatedAt={updatedAt} />}
    title={name}
    subtitle={description}
    link={link}
  />
);

export default RepoCard;
