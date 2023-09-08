import classNames from 'classnames';
import React, { useCallback } from 'react';
import CheckIcon from 'components/icons/CheckIcon';
import cn from './CheckBox.module.scss';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ className, onChange, disabled, ...props }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  return (
    <label className={classNames(className, cn['label'], disabled && cn['disabled'])}>
      <input className={cn['input']} type="checkbox" onChange={handleChange} disabled={disabled} {...props} />
      <CheckIcon className={cn['check']} />
    </label>
  );
};

export default CheckBox;
