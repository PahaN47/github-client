import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import { SCROLL_TO_TOP_TRANSITION_DURATION } from './ScrollToTop.const';
import cn from './ScrollToTop.module.scss';

export type ScrollToTopProps = {
  onClick: () => void;
  visible?: boolean;
};

const transitionClassNames = {
  enterActive: cn['wrap-enter-active'],
  enterDone: cn['wrap-enter-done'],
};

const ScrollToTop: React.FC<ScrollToTopProps> = ({ onClick, visible }) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={visible}
      nodeRef={wrapRef}
      timeout={SCROLL_TO_TOP_TRANSITION_DURATION}
      classNames={transitionClassNames}
      mountOnEnter
      unmountOnExit
    >
      <div className={cn['wrap']} ref={wrapRef}>
        <div className={cn['container']}>
          <div className={cn['outer-shadow']}>
            <div className={cn['inner-shadow']} />
          </div>
          <button className={cn['button']} onClick={onClick}>
            <ArrowDownIcon className={cn['up-icon']} />
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default ScrollToTop;
