import classNames from 'classnames';
import React, { memo } from 'react';
import cn from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'default';
};

export type IconWrapProps = Pick<IconProps, 'color' | 'children'> & {
  useStroke?: boolean;
  useFill?: boolean;
};

const Icon: React.FC<React.PropsWithChildren<IconWrapProps>> = ({ color, useStroke, useFill, children }) => (
  <>
    <div
      className={classNames(cn['icon-styles'], useStroke && cn['stroke'], useFill && cn['fill'])}
      data-color={color}
    />
    {children}
  </>
);

export default memo(Icon);
