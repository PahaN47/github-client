import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import RepoListStore, { RepoType } from 'store/RepoListStore';
import { arrayQuery, numberQuery, stringQuery } from 'store/models/QueryStore';
import { getOptionKeys } from 'utils/getOptionKeys';
import { getQueryString } from 'utils/getQueryString';
import { useQuery } from 'utils/hooks';
import { useLocalStore } from 'utils/hooks/useLocalStore';
import Filters, { FilterValues } from './components/Filters';
import RepoCard from './components/RepoCard';
import cn from './ReposPage.module.scss';

const repoPageQuery = {
  page: numberQuery(1),
  type: arrayQuery(stringQuery<RepoType>()),
};

const ReposPage: React.FC = () => {
  const [query, setQuery] = useQuery(repoPageQuery);

  const navigate = useNavigate();
  const params = useParams();

  const org = params.owner ?? '';

  const repoListStore = useLocalStore(() => new RepoListStore({ org, page: query.page, types: query.type }));

  const loading = repoListStore.status.isPending;

  const handleSearch = useCallback(({ org, types }: FilterValues) => {
    const typeKeys = getOptionKeys(types);
    repoListStore.getRepoList({ org, types: typeKeys });
    navigate({
      pathname: `/repos/${org}`,
      search: getQueryString({ type: typeKeys }),
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      repoListStore.getRepoList({ org, page, types: query.type });
      setQuery({ page, type: query.type });
    },
    [org, query.type],
  );

  return (
    <PageLayout className={cn['page']}>
      <div className={cn['title']}>
        <Text className={cn['title-top']} color="primary" view="title" maxLines={3}>
          List organization repositories
        </Text>
        <Text className={cn['title-bottom']} color="secondary" view="p-20" maxLines={2}>
          List repositories for specified organization
        </Text>
      </div>
      <Filters initialOrg={org} initialTypes={query.type} onSearch={handleSearch} loading={loading} />

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
              onChange={handlePageChange}
              pageCount={repoListStore.pagination.pageCount}
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
  );
};

export default observer(ReposPage);
