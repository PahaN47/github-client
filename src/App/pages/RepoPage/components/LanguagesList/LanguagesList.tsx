import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import { LanguageModel } from 'store/models/CurrentRepoStore';
import LanguageListItem from './components/LanguageListItem';
import cn from './LanguagesList.module.scss';

export type LanguagesListProps = {
  className?: string;
  list: LanguageModel[];
};

const LanguagesList: React.FC<LanguagesListProps> = ({ className, list }) => {
  return (
    <div className={classNames(className, cn['wrap'])}>
      <Text view="p-18" weight="bold" color="primary">
        Languages
      </Text>
      <div className={cn['bar']}>
        {list.map(({ name, value, color }) => (
          <div
            key={name}
            className={cn['bar-section']}
            style={{
              width: value,
              background: color,
            }}
          />
        ))}
      </div>
      <div className={cn['list']}>
        {list.map((item) => (
          <LanguageListItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
};

export default LanguagesList;
