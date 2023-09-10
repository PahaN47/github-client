import classNames from 'classnames';
import React, { useCallback } from 'react';
import Button from 'components/Button';
import Text from 'components/Text';
import cn from './PageButton.module.scss';

export type PageButtonProps = {
  className?: string;
  value: number;
  hideValue?: boolean;
  onClick: (value: number) => void;
  selected?: boolean;
};

const PageButton: React.FC<PageButtonProps> = ({ className, value, onClick, hideValue, selected }) => {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <Button className={classNames(className, cn['button'], selected && cn['selected'])} onClick={handleClick}>
      <Text view="p-18">{hideValue ? '...' : value}</Text>
    </Button>
  );
};

export default PageButton;
