import classNames from 'classnames';
import React from 'react';
import cn from './AboveLayout.module.scss';

export type AboveLayoutProps = React.PropsWithChildren & {
  className?: string;
  visible?: boolean;
};

const AboveLayout: React.FC<AboveLayoutProps> = ({ className, children, visible = true }) => (
  <div className={classNames(className, cn['layout'])} data-visible={visible}>
    {children}
  </div>
);

export default AboveLayout;
