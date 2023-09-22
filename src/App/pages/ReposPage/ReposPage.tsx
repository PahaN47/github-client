import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import RepoListStore from 'store/RepoListStore';
import RepoListStoreContext from 'store/RepoListStore/RepoListStore.context';
import { useQueryStore } from 'store/RootStore';
import { useLocalStore } from 'utils/hooks/useLocalStore';
import Filters from './components/Filters';
import RepoCard from './components/RepoCard';
import cn from './ReposPage.module.scss';

const ReposPage: React.FC = () => {
  const params = useParams();

  const org = params.owner ?? '';

  const queryStore = useQueryStore();

  const repoListStore = useLocalStore(() => new RepoListStore(org, queryStore));

  const loading = repoListStore.status.isPending;

  const handleChangePage = useCallback((page: number) => {
    repoListStore.pagination.setPage(page);
    repoListStore.getRepoList();
  }, []);

  return (
    <RepoListStoreContext.Provider value={repoListStore}>
      <PageLayout className={cn['page']}>
        <div className={cn['title']}>
          <Text color="primary" view="title" maxLines={2}>
            List organization repositories
          </Text>
          <Text color="secondary" view="p-20" maxLines={2}>
            List repositories for specified organization
          </Text>
        </div>
        <Filters />

        <div className={cn['repo-list']}>
          {loading ? (
            <div className={cn['no-content-wrap']}>
              <Loader className={cn['loader']} size="l" />
            </div>
          ) : repoListStore.list.order.length ? (
            <>
              <div className={cn['repos']}>
                {repoListStore.list.order.map((id) => {
                  const { owner, name, description, stargazersCount, updatedAt } = repoListStore.list.entities[id];
                  return (
                    <RepoCard
                      key={id}
                      link={`/repos/${org}/${name}`}
                      avatar={owner.avatarUrl}
                      name={name}
                      description={description}
                      stargazersCount={stargazersCount}
                      updatedAt={updatedAt}
                    />
                  );
                })}
              </div>
              <Pagination
                page={repoListStore.pagination.page}
                pageCount={repoListStore.pagination.pageCount}
                onChange={handleChangePage}
              />
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
        </div>
      </PageLayout>
    </RepoListStoreContext.Provider>
  );
};

export default observer(ReposPage);
