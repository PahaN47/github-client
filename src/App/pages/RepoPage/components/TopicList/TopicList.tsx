import classNames from 'classnames';
import React from 'react';
import Text from 'components/Text';
import cn from './TopicList.module.scss';

export type TopicListProps = {
  className?: string;
  topics: string[];
};

const TopicList: React.FC<TopicListProps> = ({ className, topics }) => (
  <div className={classNames(className, cn['wrap'])}>
    {topics.map((topic) => (
      <div key={topic} className={cn['topic']}>
        <Text tag="span" weight="bold">
          {topic}
        </Text>
      </div>
    ))}
  </div>
);

export default TopicList;
