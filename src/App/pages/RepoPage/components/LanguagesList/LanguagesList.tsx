import classNames from 'classnames';
import React, { useMemo } from 'react';
import Text from 'components/Text';
import languageColors from 'config/languageColors.json';
import cn from './LanguagesList.module.scss';

export type LanguagesListProps = {
  className?: string;
  list: Record<string, number>;
};

const LanguagesList: React.FC<LanguagesListProps> = ({ className, list }) => {
  const languagesParsed = useMemo(() => {
    const langaugesSum = Object.values(list).reduce((acc, value) => acc + value, 0);

    return Object.entries(list).map(([name, count]) => ({
      name,
      value: `${((count / langaugesSum) * 100).toFixed(1)}%`,
      color: languageColors[name as keyof typeof languageColors]?.color ?? 'var(--brand)',
    }));
  }, [list]);

  return (
    <div className={classNames(className, cn['wrap'])}>
      <Text view="p-18" weight="bold" color="primary">
        Languages
      </Text>
      <div className={cn['bar']}>
        {languagesParsed.map(({ name, value, color }) => (
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
        {languagesParsed.map(({ name, value, color }) => (
          <div key={name} className={cn['list-item']}>
            <div className={cn['marker']} style={{ background: color }} />
            <Text view="p-14" color="secondary">
              <span>{name}</span> {value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesList;
