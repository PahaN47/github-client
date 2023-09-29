import React, { useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { LAYOUT_TRANSITION_DURATION } from './AboveLayout.const';
import './AboveLayout.scss';

export type AboveLayoutProps = React.PropsWithChildren & {
  visible?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const AboveLayout: React.FC<AboveLayoutProps> = ({ children, visible = true, onClick }) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.target !== e.currentTarget) {
        return;
      }

      onClick?.(e);
    },
    [onClick],
  );

  return (
    <CSSTransition
      in={visible}
      nodeRef={layoutRef}
      timeout={LAYOUT_TRANSITION_DURATION}
      classNames="above-layout"
      mountOnEnter
      unmountOnExit
    >
      <div className="above-layout" ref={layoutRef} onClick={onClick && handleClick}>
        {children}
      </div>
    </CSSTransition>
  );
};

export default AboveLayout;
