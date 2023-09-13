import classNames from 'classnames';
import React, { memo } from 'react';
import Text from 'components/Text';
import cn from './Topic.module.scss';

export type TopicProps = {
  className?: string;
  topic: string;
};

const Topic: React.FC<TopicProps> = memo(({ className, topic }) => (
  <div className={classNames(className, cn['topic'])}>
    <Text tag="span" weight="bold">
      {topic}
    </Text>
  </div>
));

Topic.displayName = 'Topic';

export default Topic;
