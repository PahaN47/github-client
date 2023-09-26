import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import Text from 'components/Text';
import { useLastSeenRepos } from 'utils/hooks';
import LastSeenRepoItem from '../LastSeenRepoItem';
import cn from './LastSeenReposList.module.scss';

export type LastSeenReposListProps = {
  className?: string;
  onItemClick?: () => void;
};

const LastSeenReposList: React.FC<LastSeenReposListProps> = ({ className, onItemClick }) => {
  const store = useLastSeenRepos();

  return (
    <div className={classNames(className, cn['list'])}>
      {store.repos.order.length ? (
        store.repos.order.map((id) => <LastSeenRepoItem key={id} onClick={onItemClick} {...store.repos.entities[id]} />)
      ) : (
        <Text className={cn['placeholder']} view="p-18" weight="medium" color="secondary">
          No recent repositories
        </Text>
      )}
    </div>
  );
};

export default observer(LastSeenReposList);
