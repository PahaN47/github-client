import classNames from 'classnames';
import React, { forwardRef, useCallback } from 'react';
import cn from './Input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ onChange, afterSlot, className, ...props }, ref) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={classNames(className, cn['wrap'])}>
      <input
        className={classNames(cn['input'], afterSlot && cn['has-after'])}
        onChange={handleChange}
        type="text"
        ref={ref}
        {...props}
      />
      <div className={cn['after']}>{afterSlot}</div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
