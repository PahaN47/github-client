import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Option } from 'components/Dropdown';
import Text from 'components/Text';
import { isSafariMobile } from 'config/isSafariMobile';
import cn from './DropdownOption.module.scss';

export type DropDownOptionProps<T extends string> = {
  className?: string;
  value: Option<T>;
  onSelect: (value: Option<T>) => void;
  onDeselect?: (value: Option<T>) => void;
  selected?: boolean;
};

const DropDownOption = <T extends string>({
  className,
  value,
  onSelect,
  onDeselect,
  selected,
}: DropDownOptionProps<T>) => {
  const handleClick = useCallback(() => {
    if (selected && onDeselect) {
      onDeselect(value);
      return;
    }
    if (!selected) {
      onSelect(value);
    }
  }, [onDeselect, onSelect, selected, value]);

  const clickHandler = useMemo<React.ButtonHTMLAttributes<HTMLButtonElement>>(
    () => Object.fromEntries([[isSafariMobile ? 'onClick' : 'onTouchStart', handleClick]]),
    [handleClick],
  );

  return (
    <button className={classNames(className, cn['option'], selected && cn['selected'])} {...clickHandler}>
      <Text view="p-16">{value.value}</Text>
    </button>
  );
};

export default DropDownOption;
