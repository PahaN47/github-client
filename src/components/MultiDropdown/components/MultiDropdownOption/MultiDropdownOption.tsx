import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Option } from 'components/MultiDropdown';
import Text from 'components/Text';
import cn from './MultiDropdownOption.module.scss';

export type MultiDropDownOptionProps = {
  className?: string;
  value: Option;
  onSelect: (value: Option) => void;
  onDeselect?: (value: Option) => void;
  selected?: boolean;
};

const MultiDropDownOption: React.FC<MultiDropDownOptionProps> = ({
  className,
  value,
  onSelect,
  onDeselect,
  selected,
}) => {
  const handleClick = useCallback(() => {
    if (selected && onDeselect) {
      onDeselect(value);
      return;
    }
    if (!selected) {
      onSelect(value);
    }
  }, [onDeselect, onSelect, selected, value]);

  return (
    <button className={classNames(className, cn['option'], selected && cn['selected'])} onClick={handleClick}>
      <Text view="p-16">{value.value}</Text>
    </button>
  );
};

export default MultiDropDownOption;
