import React, { memo } from 'react';
import Icon, { IconProps } from '../Icon';

const ArrowDownIcon: React.FC<IconProps> = ({ color, width = 24, height = 24, ...props }) => (
  <Icon color={color} useFill>
    <svg width={width} height={height} viewBox="0 -960 960 960" {...props}>
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  </Icon>
);

export default memo(ArrowDownIcon);
