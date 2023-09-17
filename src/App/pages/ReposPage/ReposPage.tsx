import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Option } from 'components/Dropdown';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import repoTypeOptions from 'config/repoTypeOptions';
import RepoListStore, { RepoType } from 'store/RepoListStore';
import { FetchStatus } from 'store/types';
import { getOptionKeys } from 'utils/getOptionKeys';
import { getQueryString } from 'utils/getQueryString';
import { useQuery } from 'utils/hooks';
import { useInitialAction } from 'utils/hooks/useInitialAction';
import { useLocalStore } from 'utils/hooks/useLocalStore';
import Filters, { FilterValues } from './components/Filters';
import RepoCard from './components/RepoCard';
import cn from './ReposPage.module.scss';

type ReposPageQuery = {
  page: number;
  type: RepoType[];
};

const ReposPage: React.FC = () => {
  const { repoList, getRepoList, repoListStatus, repoCount, pageLimit } = useLocalStore(() => new RepoListStore());

  const { page, type } = useQuery<ReposPageQuery>((params) => ({
    page: +(params?.page ?? 1),
    type: [params?.type ?? []].flat() as RepoType[],
  }));

  const navigate = useNavigate();
  const params = useParams();

  const org = params.owner ?? '';
  const initialTypeOptions = useRef<Option<RepoType>[] | null>();
  if (!initialTypeOptions.current) {
    initialTypeOptions.current = type.map((key) => repoTypeOptions.entities[key]);
  }

  const pageCount = Math.ceil(repoCount / pageLimit);
  const loading = repoListStatus === FetchStatus.PENDGING;

  useInitialAction(() => {
    getRepoList({ org, page, types: type });
  });

  const handleSearch = useCallback(
    ({ org, types }: FilterValues) => {
      const typeKeys = getOptionKeys(types);
      getRepoList({ org, types: typeKeys });
      navigate({
        pathname: `/repos/${org}`,
        search: getQueryString({ type: typeKeys }),
      });
    },
    [getRepoList, navigate],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      getRepoList({ org, page, types: type });
      navigate({ search: getQueryString({ page, type }) });
    },
    [getRepoList, org, type, navigate],
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
      <Filters initialOrg={org} initialTypes={initialTypeOptions.current} onSearch={handleSearch} loading={loading} />

      <div className={cn['repo-list']}>
        {loading ? (
          <div className={cn['no-content-wrap']}>
            <Loader className={cn['loader']} size="l" />
          </div>
        ) : repoList.order.length ? (
          <>
            <div className={cn['repos']}>
              {repoList.order.map((id) => {
                const { owner, name, description, stargazersCount, updatedAt } = repoList.entities[id];
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
