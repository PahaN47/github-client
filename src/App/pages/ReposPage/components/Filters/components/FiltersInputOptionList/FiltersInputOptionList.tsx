import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import FiltersInputOption from '../FiltersInputOption';
import { FILTERS_INPUT_OPTION_LIST_TRANSITION_DURATION } from './FiltersInputOptionList.const';
import cn from './FiltersInputOptionList.module.scss';

const transitionClassNames = {
  enterDone: cn['list-enter-done'],
  enterActive: cn['list-enter-active'],
  exitActive: cn['list-exit-active'],
};

export type FiltersInputOptionListProps = {
  className?: string;
  options?: string[];
  onOptionSelect?: (option: string) => void;
  onOptionEnter?: (option: string) => void;
  visible?: boolean;
};

const FiltersInputOptionList = forwardRef<HTMLDivElement, FiltersInputOptionListProps>(
  ({ className, options, onOptionSelect, onOptionEnter, visible = false }, ref) => (
    <CSSTransition
      in={!!options?.length && visible}
      nodeRef={ref}
      timeout={FILTERS_INPUT_OPTION_LIST_TRANSITION_DURATION}
      classNames={transitionClassNames}
    >
      <div className={classNames(className, cn['list'])} ref={ref}>
        {options?.map((option) => (
          <FiltersInputOption key={option} option={option} onSelect={onOptionSelect} onEnter={onOptionEnter} />
        ))}
      </div>
    </CSSTransition>
  ),
);
FiltersInputOptionList.displayName = 'FiltersInputOptionList';

export default FiltersInputOptionList;
