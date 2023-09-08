import React from 'react';
import ArrowDownIcon from './ArrowDownIcon';
import CheckIcon from './CheckIcon';
import { IconProps } from './Icon';

export default {
  title: 'Icons',
  argTypes: {
    className: {
      control: 'text',
    },
    color: {
      options: ['primary', 'secondary', 'accent'],
      mapping:  ['primary', 'secondary', 'accent'],
      control: 'select'
    },
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
  },
};

export const Default = (props: IconProps) => (
    <div style={{ display: 'flex', gap: '20px'}}>
      <CheckIcon {...props} />
      <ArrowDownIcon {...props} />
    </div>
);
