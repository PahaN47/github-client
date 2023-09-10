import classNames from 'classnames';
import React from 'react';
import Loader from 'components/Loader';
import Text from 'components/Text';
import cn from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ className, loading, disabled, children, ...props }) => (
  <button
    className={classNames(className, cn['button'], disabled && cn['disabled'])}
    disabled={loading || disabled}
    {...props}
  >
    {loading && <Loader className={cn['loader']} size="s" />}
    <Text className={cn['content']} tag="div" view="button">
      {children}
    </Text>
  </button>
);

export default Button;
