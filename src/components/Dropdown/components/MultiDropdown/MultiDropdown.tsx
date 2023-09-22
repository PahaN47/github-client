import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Option } from 'components/Dropdown';
import cn from 'components/Dropdown/Dropdown.module.scss';
import Input from 'components/Input';
import ArrowDownIcon from 'components/icons/ArrowDownIcon/ArrowDownIcon';
import DropdownOption from '../DropdownOption';

export type MultiDropdownProps<T extends string> = {
  className?: string;
  options: Option<T>[];
  value: Option<T>[];
  onChange: (value: Option<T>[]) => void;
  disabled?: boolean;
  getTitle: (value: Option<T>[]) => string;
};

const MultiDropdown = <T extends string>({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle,
}: MultiDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const title = getTitle(value);
  const [inputValue, setInputValue] = useState(value.length ? title : '');

  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(true);
      setInputValue('');
    }
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsOpen(false);
        setInputValue(value.length ? title : '');
      }
    },
    [title, value.length],
  );

  const handleInputChange = useCallback((v: string) => {
    setInputValue(v);
  }, []);

  const filteredOptions = useMemo(
    () =>
      options
        .filter((item) => item.value.toLowerCase().startsWith(inputValue.trimStart().toLowerCase()))
        .map((item) => ({
          ...item,
          selected: value.findIndex((valueItem) => valueItem.key === item.key) !== -1,
        })),
    [inputValue, options, value],
  );

  const handleItemSelect = useCallback(
    (item: Option<T>) => {
      onChange([...value, item]);
    },
    [onChange, value],
  );

  const handleItemDeselect = useCallback(
    (item: Option<T>) => {
      onChange(value.filter((selectedItem) => selectedItem.key !== item.key));
    },
    [onChange, value],
  );

  return (
    <div className={classNames(className, cn['wrap'])} onFocus={handleFocus} onBlur={handleBlur}>
      <Input
        className={cn['input']}
        placeholder={title}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        afterSlot={<ArrowDownIcon color="secondary" />}
      />
      {!disabled && isOpen && (
        <div className={cn['options']}>
          {filteredOptions.map(({ selected, ...value }) => (
            <DropdownOption
              key={value.key}
              value={value}
              onSelect={handleItemSelect}
              onDeselect={handleItemDeselect}
              selected={selected}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
