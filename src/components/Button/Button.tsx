import classNames from 'classnames';
import React from 'react';
import Loader from 'components/Loader';
import Text from 'components/Text';
import cn from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
  small?: boolean;
};

const Button: React.FC<ButtonProps> = ({ className, loading, disabled, children, small, ...props }) => (
  <button
    className={classNames(className, cn['button'], disabled && cn['disabled'], small && cn['small'])}
    disabled={loading || disabled}
    {...props}
  >
    {loading && <Loader className={cn['loader']} size="s" />}
    <Text className={cn['content']} tag="div" view={small ? 'button-s' : 'button'}>
      {children}
    </Text>
  </button>
);

export default Button;
