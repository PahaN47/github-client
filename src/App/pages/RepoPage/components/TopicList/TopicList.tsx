import classNames from 'classnames';
import React from 'react';
import Topic from './components/Topic';
import cn from './TopicList.module.scss';

export type TopicListProps = {
  className?: string;
  topics: string[];
};

const TopicList: React.FC<TopicListProps> = ({ className, topics }) => (
  <div className={classNames(className, cn['wrap'])}>
    {topics.map((topic) => (
      <Topic key={topic} topic={topic} />
    ))}
  </div>
);

export default TopicList;
