import React, { memo } from 'react';
import Icon, { IconProps } from '../Icon';

const ArrowLeftIcon: React.FC<IconProps> = ({ color, width = 32, height = 32, ...props }) => (
  <Icon color={color} useStroke>
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...props}>
      <g id="vuesax/linear/arrow-right">
        <g id="arrow-right">
          <path
            id="Vector"
            d="M20.12 26.5599L11.4267 17.8666C10.4 16.8399 10.4 15.1599 11.4267 14.1333L20.12 5.43994"
            stroke="#AFADB5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  </Icon>
);

export default memo(ArrowLeftIcon);
