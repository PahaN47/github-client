import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef } from 'react';
import Button from 'components/Button';
import InfiniteContainer from 'components/InfiniteContainer';
import Loader from 'components/Loader';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import PaginationStore from 'store/PaginationStore';
import { RepoModel } from 'store/models/RepoListStore';
import RepoCard from '../RepoCard';
import cn from './RepoList.module.scss';

export type RepoListProps = {
  list: RepoModel[];
  pagination: PaginationStore;
  onPageChange: (page: number) => void;
  getRepoLink: (repo: RepoModel) => string;
  infinite?: boolean;
  onSetInfinite: () => void;
  onLoadMore: () => void;
  loading: boolean;
};

const RepoList: React.FC<RepoListProps> = ({
  list,
  pagination,
  onPageChange,
  getRepoLink,
  infinite,
  onSetInfinite,
  onLoadMore,
  loading,
}) => {
  const initialLoadRef = useRef(true);

  const repoItems = useMemo(
    () =>
      list.map((repo) => (
        <RepoCard
          key={repo.id}
          link={getRepoLink(repo)}
          avatar={repo.owner.avatarUrl}
          name={repo.name}
          description={repo.description}
          stargazersCount={repo.stargazersCount}
          updatedAt={repo.updatedAt}
        />
      )),
    [getRepoLink, list],
  );

  const hasMore = pagination.lastPage < pagination.pageCount || initialLoadRef.current;

  const handleReachBottom = useMemo(() => (infinite ? onLoadMore : undefined), [infinite, onLoadMore]);

  useEffect(() => {
    initialLoadRef.current = false;
  }, []);

  return (
    <InfiniteContainer
      className={cn['repo-list']}
      onReachBottom={handleReachBottom}
      hasMore={hasMore}
      hideOnLoading={!infinite}
      loading={loading}
      loader={
        <div className={cn['loader-wrap']}>
          <Loader className={cn['loader']} size="l" />
        </div>
      }
    >
      {repoItems.length || initialLoadRef.current ? (
        <>
          <div className={cn['repos']}>{repoItems}</div>
          {!infinite && pagination.pageCount > 1 && (
            <>
              <Button className={cn['show-all']} onClick={onSetInfinite}>
                Show all
              </Button>
              <Pagination page={pagination.page} onChange={onPageChange} pageCount={pagination.pageCount} />
            </>
          )}
        </>
      ) : (
        <div className={cn['no-content-wrap']}>
          <Text view="p-20" weight="normal" color="primary">
            Sorry, but nothing was found!
          </Text>
          <Text view="p-18" color="secondary">
            Try adjusting your search
          </Text>
        </div>
      )}
    </InfiniteContainer>
  );
};
export default observer(RepoList);
