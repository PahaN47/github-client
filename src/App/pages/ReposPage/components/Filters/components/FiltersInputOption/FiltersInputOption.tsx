import classNames from 'classnames';
import React, { useCallback, useMemo, useRef } from 'react';
import { isSafariMobile } from 'config/isSafariMobile';
import cn from './FiltersInputOption.module.scss';

export type FiltersInputOptionProps = React.PropsWithChildren & {
  className?: string;
  option: string;
  onSelect?: (value: string) => void;
};

const FiltersInputOption: React.FC<FiltersInputOptionProps> = ({ className, option, onSelect }) => {
  const optionRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(() => {
    onSelect?.(option);
  }, [onSelect, option]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key.toLowerCase() !== 'enter') {
        return;
      }

      e.preventDefault();
      handleSelect();
    },
    [handleSelect],
  );

  const clickHandler = useMemo<React.ButtonHTMLAttributes<HTMLButtonElement>>(
    () => Object.fromEntries([[isSafariMobile ? 'onClick' : 'onTouchStart', handleSelect]]),
    [handleSelect],
  );

  return (
    <button className={classNames(className, cn['wrap'])} {...clickHandler} onKeyDown={handleKeyDown} ref={optionRef}>
      {option}
    </button>
  );
};
FiltersInputOption.displayName = 'FiltersInputOption';

export default FiltersInputOption;
