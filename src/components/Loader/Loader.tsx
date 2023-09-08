import classNames from 'classnames';
import React from 'react';
import cn from './Loader.module.scss';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size, className }) => (
  <div className={classNames(className, cn['loader'])} data-size={size}>
    <svg viewBox="0 0 240 240">
      <circle cx="120" cy="120" r="105" />
    </svg>
  </div>
);

export default Loader;
