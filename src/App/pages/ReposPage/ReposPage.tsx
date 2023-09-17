import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import { useStore } from 'store/store';
import { FetchStatus } from 'store/types';
import Filters, { FilterValues } from './components/Filters';
import RepoCard from './components/RepoCard';
import cn from './ReposPage.module.scss';

const ReposPage: React.FC = () => {
  const { repoList, getRepoList, repoListStatus, repoCount, pageLimit } = useStore((store) => store.repoList);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const page = +(searchParams.get('page') ?? 1);
  const org = params.owner ?? '';

  const [filters, setFilters] = useState<FilterValues>({ org, types: [] });

  const pageCount = Math.ceil(repoCount / pageLimit);
  const loading = repoListStatus === FetchStatus.PENDGING;

  useEffect(() => {
    if (repoListStatus === FetchStatus.IDLE) {
      getRepoList({ org, page });
      navigate(`/repos/${org}`);
      setSearchParams({ page: page.toString() }, { replace: true });
    }
  }, [getRepoList, navigate, org, page, repoListStatus, setSearchParams]);

  const handleSearch = useCallback(
    ({ org }: FilterValues) => {
      getRepoList({ org });
      navigate(`/repos/${org}`);
    },
    [getRepoList, navigate],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      getRepoList({ org, page });
      setSearchParams({ page: page.toString() }, { replace: true });
    },
    [getRepoList, org, setSearchParams],
  );

  const handleCardClick = useCallback(
    (name: string) => {
      navigate(`/repos/${org}/${name}`, { relative: 'path' });
    },
    [navigate, org],
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
      <Filters value={filters} onChange={setFilters} onSearch={handleSearch} loading={loading} />

      <div className={cn['repo-list']}>
        {!loading ? (
          <>
            <div className={cn['repos']}>
              {repoList.map(({ id, owner, stargazers_count, updated_at, name, description }) => (
                <RepoCard
                  key={id}
                  className={cn['repo-card']}
                  avatar={owner.avatar_url}
                  name={name}
                  description={description}
                  onClick={handleCardClick}
                  stargazersCount={stargazers_count}
                  updatedAt={updated_at}
                />
              ))}
            </div>
            <Pagination page={page} onChange={handlePageChange} pageCount={pageCount} />
          </>
        ) : (
          <Loader className={cn['loader']} size="l" />
        )}
      </div>
    </PageLayout>
  );
};

export default observer(ReposPage);
