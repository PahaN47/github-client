import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import { Language } from 'store/CurrentRepoStore';
import cn from './LanguageListItem.module.scss';

export type LanguageListItemProps = Language & {
  className?: string;
};

const LanguageListItem: React.FC<LanguageListItemProps> = ({ className, name, value, color }) => (
  <div className={classNames(className, cn['wrap'])}>
    <div className={cn['marker']} style={{ background: color }} />
    <Text view="p-14" color="secondary">
      <span>{name}</span> {value}
    </Text>
  </div>
);

export default LanguageListItem;
