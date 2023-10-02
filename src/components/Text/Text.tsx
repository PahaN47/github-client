import classNames from 'classnames';
import React from 'react';
import cn from './Text.module.scss';

export type TextProps = {
  className?: string;
  view?: 'title' | 'button' | 'button-s' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  weight?: 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({ className, view, tag: Tag = 'p', weight, children, color, maxLines }) => (
  <Tag
    className={classNames(className, cn['text'], maxLines && cn['limit-lines'])}
    style={{
      lineClamp: maxLines,
      WebkitLineClamp: maxLines,
    }}
    data-view={view ?? ''}
    data-color={color}
    data-weight={weight}
  >
    {children}
  </Tag>
);

export default Text;
