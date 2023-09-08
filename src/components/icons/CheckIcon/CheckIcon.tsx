import React from 'react';
import Icon, { IconProps } from '../Icon';

const CheckIcon: React.FC<IconProps> = ({ color, width = 24, height = 24, ...props }) => (
  <Icon color={color} useStroke>
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 11.6129L9.87755 18L20 7" stroke="black" strokeWidth="2" />
    </svg>
  </Icon>
);

export default CheckIcon;
