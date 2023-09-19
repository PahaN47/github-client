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
  const { page, type } = useQuery(repoPageQuery);

  const navigate = useNavigate();
  const params = useParams();

  const org = params.owner ?? '';

  const repoListStore = useLocalStore(() => new RepoListStore({ org, page, types: type }));

  const pageCount = Math.ceil(repoListStore.repoCount / repoListStore.pageLimit);
  const loading = repoListStore.isPending;

  const handleSearch = useCallback(({ org, types }: FilterValues) => {
    const typeKeys = getOptionKeys(types);
    repoListStore.getRepoList({ org, types: typeKeys });
    navigate({
      pathname: `/repos/${org}`,
      search: getQueryString({ page, type: typeKeys }),
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      repoListStore.getRepoList({ org, page, types: type });
      navigate({ search: getQueryString({ page, type }) });
    },
    [org, type],
  );

  const handleCardClick = useCallback(
    (name: string) => {
      navigate(`/repos/${org}/${name}`, { relative: 'path' });
    },
    [org],
  );

  return (
    <PageLayout className={cn['page']}>
      <div className={cn['title']}>
        <Text color="primary" view="title" maxLines={2}>
          List organization repositories
        </Text>
        <Text color="secondary" view="p-20" maxLines={2}>
          List repositories for specified organization
        </Text>
      </div>
      <Filters initialOrg={org} initialTypes={type} onSearch={handleSearch} loading={loading} />

      <div className={cn['repo-list']}>
        {loading ? (
          <div className={cn['no-content-wrap']}>
            <Loader className={cn['loader']} size="l" />
          </div>
        ) : repoListStore.repoList.order.length ? (
          <>
            <div className={cn['repos']}>
              {repoListStore.repoList.order.map((id) => {
                const { owner, name, description, stargazersCount, updatedAt } = repoListStore.repoList.entities[id];
                return (
                  <RepoCard
                    key={id}
                    className={cn['repo-card']}
                    avatar={owner.avatarUrl}
                    name={name}
                    description={description}
                    onClick={handleCardClick}
                    stargazersCount={stargazersCount}
                    updatedAt={updatedAt}
                  />
                );
              })}
            </div>
            <Pagination page={page} onChange={handlePageChange} pageCount={pageCount} />
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
