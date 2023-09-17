import classNames from 'classnames';
import React from 'react';
import cn from './Avatar.module.scss';

export type AvatarProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  src?: string;
};

const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => (
  <img className={classNames(className, cn['image'])} {...props} />
);

export default Avatar;
