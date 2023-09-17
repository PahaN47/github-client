import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import { LanguageModel } from 'store/models/CurrentRepoStore';
import cn from './LanguageListItem.module.scss';

export type LanguageListItemProps = LanguageModel & {
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
