import classNames from 'classnames';
import React, { useCallback } from 'react';
import cn from './AboveLayout.module.scss';

export type AboveLayoutProps = React.PropsWithChildren & {
  className?: string;
  visible?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  clickable?: boolean;
};

const AboveLayout: React.FC<AboveLayoutProps> = ({ className, children, visible = true, onClick }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (e.target === e.currentTarget) {
        onClick?.(e);
      }
    },
    [onClick],
  );

  return (
    <div className={classNames(className, cn['layout'])} onClick={handleClick} data-visible={visible}>
      {children}
    </div>
  );
};

export default AboveLayout;
