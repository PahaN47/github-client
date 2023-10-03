import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';
import cn from './FiltersInputOption.module.scss';

export type FiltersInputOptionProps = React.PropsWithChildren & {
  className?: string;
  option: string;
  onSelect?: (value: string) => void;
  onEnter?: (value: string) => void;
};

const FiltersInputOption: React.FC<FiltersInputOptionProps> = ({ className, option, onSelect, onEnter }) => {
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
      onEnter?.(option);
    },
    [onEnter, option],
  );

  return (
    <button
      className={classNames(className, cn['wrap'])}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      ref={optionRef}
    >
      {option}
    </button>
  );
};
FiltersInputOption.displayName = 'FiltersInputOption';

export default FiltersInputOption;
