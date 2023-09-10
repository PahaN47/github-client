import { format } from 'date-fns';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'components/Card';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Text from 'components/Text';
import StarIcon from 'components/icons/StarIcon';
import { useStore } from 'store/store';
import { FetchStatus } from 'store/types';
import Filters, { FilterValues } from './components/Filters';
import PageSelector from './components/PageSelector';
import cn from './ReposPage.module.scss';

const getCardCaption = (stargazersCount: number, updatedAt: string) => {
  const dateUpdatedAt = new Date(updatedAt);
  return `\u00a0${stargazersCount}${'\u00a0'.repeat(7)}Updated ${
    dateUpdatedAt.getFullYear() === new Date().getFullYear()
      ? format(new Date(updatedAt), 'dd MMM')
      : format(new Date(updatedAt), 'dd MMM, y')
  }`;
};

const ReposPage: React.FC = () => {
  const { repoList, getRepoList, repoListStatus, repoCount, pageLimit, org, page } = useStore((store) => store.repos);

  const [filters, setFilters] = useState<FilterValues>({ org, types: [] });

  const pageCount = Math.ceil(repoCount / pageLimit);
  const loading = repoListStatus === FetchStatus.PENDGING;

  const pageRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (repoListStatus === FetchStatus.IDLE) {
      getRepoList({ org: filters.org, page });
    }
  }, [filters, getRepoList, page, repoListStatus]);

  const handleSearch = useCallback(
    ({ org }: FilterValues) => {
      getRepoList({ org });
    },
    [getRepoList],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      getRepoList({ org: filters.org, page });
      pageRef.current?.scrollTo(0, 0);
    },
    [filters.org, getRepoList],
  );

  const makeHandleCardClick = useCallback(
    (name: string) => () => {
      navigate(`${org}/${name}`, { relative: 'path' });
    },
    [navigate, org],
  );

  return (
    <PageLayout className={cn['page']} ref={pageRef}>
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
                <Card
                  key={id}
                  className={cn['repo-card']}
                  image={owner.avatar_url}
                  captionSlot={
                    <div className={cn['card-caption']}>
                      <StarIcon color="default" />
                      {getCardCaption(stargazers_count, updated_at)}
                    </div>
                  }
                  title={name}
                  subtitle={description}
                  onClick={makeHandleCardClick(name)}
                />
              ))}
            </div>
            <PageSelector page={page} onChange={handlePageChange} pageCount={pageCount} />
          </>
        ) : (
          <Loader className={cn['loader']} size="l" />
        )}
      </div>
    </PageLayout>
  );
};

export default observer(ReposPage);
