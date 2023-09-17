import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import { LanguageModel } from 'store/models/CurrentRepoStore';
import { Collection } from 'store/models/shared';
import LanguageListItem from './components/LanguageListItem';
import cn from './LanguagesList.module.scss';

export type LanguagesListProps = {
  className?: string;
  list: Collection<string, LanguageModel>;
};

const LanguagesList: React.FC<LanguagesListProps> = ({ className, list }) => {
  return (
    <div className={classNames(className, cn['wrap'])}>
      <Text view="p-18" weight="bold" color="primary">
        Languages
      </Text>
      <div className={cn['bar']}>
        {list.order.map((name) => (
          <div
            key={name}
            className={cn['bar-section']}
            style={{
              width: list.entities[name].value,
              background: list.entities[name].color,
            }}
          />
        ))}
      </div>
      <div className={cn['list']}>
        {list.order.map((name) => (
          <LanguageListItem key={name} {...list.entities[name]} />
        ))}
      </div>
    </div>
  );
};

export default LanguagesList;
