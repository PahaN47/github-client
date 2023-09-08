import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import Input from 'components/Input';
import ArrowDownIcon from 'components/icons/ArrowDownIcon/ArrowDownIcon';
import MultiDropdownOption from './components/MultiDropdownOption';
import cn from './MultiDropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({ className, options, value, onChange, disabled, getTitle }) => {
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
    (item: Option) => {
      onChange([...value, item]);
    },
    [onChange, value],
  );

  const handleItemDeselect = useCallback(
    (item: Option) => {
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
            <MultiDropdownOption
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
