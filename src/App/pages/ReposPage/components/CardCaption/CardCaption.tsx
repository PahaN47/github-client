import classNames from 'classnames';
import { format } from 'date-fns';
import React, { memo } from 'react';
import StarIcon from 'components/icons/StarIcon';
import cn from './CardCaption.module.scss';

export type CardCaptionProps = {
  className?: string;
  stargazersCount: number;
  updatedAt: string;
};

const getCardCaption = (stargazersCount: number, updatedAt: string) => {
  const dateUpdatedAt = new Date(updatedAt);
  return `\u00a0${stargazersCount}${'\u00a0'.repeat(7)}Updated ${
    dateUpdatedAt.getFullYear() === new Date().getFullYear()
      ? format(new Date(updatedAt), 'dd MMM')
      : format(new Date(updatedAt), 'dd MMM, y')
  }`;
};

const CardCaption: React.FC<CardCaptionProps> = memo(({ className, stargazersCount, updatedAt }) => (
  <div className={classNames(className, cn['wrap'])}>
    <StarIcon color="default" />
    {getCardCaption(stargazersCount, updatedAt)}
  </div>
));

CardCaption.displayName = 'CardCaption';

export default CardCaption;
