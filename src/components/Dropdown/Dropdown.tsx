import React from 'react';
import MultiDropdown, { MultiDropdownProps } from './components/MultiDropdown';
import SingleDropdown, { SingleDropdownProps } from './components/SingleDropdown';

export type Option<T extends string> = {
  key: T;
  value: string;
};

export type DropdownProps<T extends string> =
  | ({
      type?: 'multi';
    } & MultiDropdownProps<T>)
  | ({
      type: 'single';
    } & SingleDropdownProps<T>);

const Dropdown = <T extends string>(props: DropdownProps<T>) => {
  switch (props.type) {
    case 'single':
      return <SingleDropdown {...props} />;
    default:
      return <MultiDropdown {...props} />;
  }
};

export default Dropdown;
