import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from 'components/Input';
import FiltersInputOptionList from '../FiltersInputOptionList';
import { FILTERS_INPUT_MAX_LENGTH } from './FiltersInput.const';
import cn from './FiltersInput.module.scss';

export type FiltersInputProps = {
  className?: string;
  onEnterKey?: (value?: string) => void;
  onChange: (value: string) => void;
  options?: string[];
  getOptions?: (value: string) => void;
  value: string;
  placeholder?: string;
};

const FiltersInput: React.FC<FiltersInputProps> = ({
  className,
  onEnterKey,
  onChange,
  options,
  getOptions,
  ...props
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleInputChange = useCallback(
    (value: string) => {
      onChange(value);
      getOptions?.(value);
      if (value) {
        setOptionsVisible(true);
      }
    },
    [getOptions, onChange],
  );

  const handleOptionSelect = useCallback(
    (option: string) => {
      onChange(option);
      onEnterKey?.(option);
      setOptionsVisible(false);
    },
    [onChange, onEnterKey],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key.toLocaleLowerCase();
      if (key === 'enter') {
        onEnterKey?.();
        inputRef.current?.blur();
      }

      if (key === 'arrowdown') {
        e.preventDefault();
        const options = optionsRef.current;
        if (!options) {
          return;
        }

        const firstOption = options.firstElementChild as HTMLButtonElement | null;
        if (!firstOption) {
          return;
        }

        firstOption.focus();
      }
    },
    [onEnterKey],
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }

    const handleWrapBlur = (e: FocusEvent) => {
      const wrapTarget = e.currentTarget as HTMLDivElement | null;
      const relatedTarget = e.relatedTarget as Node | null;
      if (!wrapTarget?.contains(relatedTarget)) {
        setOptionsVisible(false);
      }
    };

    wrap.addEventListener('focusout', handleWrapBlur);

    return () => {
      wrap.removeEventListener('focusout', handleWrapBlur);
    };
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const handleInputFocus = (e: FocusEvent) => {
      const target = e.currentTarget as HTMLInputElement | null;
      if (!target) {
        return;
      }
      setOptionsVisible(true);
      target.selectionStart = target.selectionEnd = FILTERS_INPUT_MAX_LENGTH;
    };

    input.addEventListener('focus', handleInputFocus);

    return () => {
      input.removeEventListener('focus', handleInputFocus);
    };
  }, []);

  useEffect(() => {
    const options = optionsRef.current;
    if (!options) {
      return;
    }

    const handleOptionsKeyDown = (e: KeyboardEvent) => {
      const options = optionsRef.current;
      if (!options) {
        return;
      }
      const key = e.key.toLocaleLowerCase();
      const targetOption = e.target as HTMLButtonElement;

      if (key === 'arrowdown') {
        e.preventDefault();
        const nextOption = targetOption.nextElementSibling as HTMLButtonElement | null;
        if (!nextOption) {
          return;
        }

        nextOption.focus();
      }
      if (key === 'arrowup') {
        e.preventDefault();
        const prevOption = targetOption.previousElementSibling as HTMLButtonElement | null;

        if (!prevOption) {
          inputRef.current?.focus();
          return;
        }

        prevOption.focus();
      }
    };

    options.addEventListener('keydown', handleOptionsKeyDown);

    return () => {
      options.removeEventListener('keydown', handleOptionsKeyDown);
    };
  }, []);

  return (
    <div className={classNames(className, cn['wrap'])} ref={wrapRef}>
      <Input
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        maxLength={FILTERS_INPUT_MAX_LENGTH}
        ref={inputRef}
        {...props}
      />
      <FiltersInputOptionList
        className={cn['options']}
        options={options}
        onOptionSelect={handleOptionSelect}
        visible={optionsVisible}
        ref={optionsRef}
      />
    </div>
  );
};

export default FiltersInput;
