import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from 'components/PageLayout';
import Text from 'components/Text';
import { isSafariMobile } from 'config/isSafariMobile';
import RepoListStore, { RepoType } from 'store/RepoListStore';
import { arrayQuery, booleanQuery, numberQuery, stringQuery } from 'store/models/QueryStore';
import { RepoModel } from 'store/models/RepoListStore';
import { getOptionKeys } from 'utils/getOptionKeys';
import { getQueryString } from 'utils/getQueryString';
import { useQuery } from 'utils/hooks';
import { useLocalStore } from 'utils/hooks/useLocalStore';
import Filters, { FilterValues } from './components/Filters';
import RepoList from './components/RepoList';
import cn from './ReposPage.module.scss';

const repoPageQuery = {
  page: numberQuery(1),
  type: arrayQuery(stringQuery<RepoType>()),
  all: booleanQuery(),
};

const ReposPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
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

  const handleLoadMore = useCallback(() => {
    repoListStore.addRepos({ org, types: query.type });
  }, [org, query.type, repoListStore]);

  const handlePageChange = useCallback(
    (page: number) => {
      repoListStore.getRepoList({ org, page, types: query.type });
      setQuery({ page, type: query.type });
    },
    [org, query.type],
  );

  const handleShowAll = useCallback(() => {
    repoListStore.getRepoList({ org, types: query.type });
    setQuery({ type: query.type, all: true });
    pageRef.current?.scrollTo(0, 0);
  }, [org, query.type]);

  const repoList = useMemo(() => Object.values(repoListStore.list.entities), [repoListStore.list.entities]);
  const getRepoLink = useCallback(({ name }: RepoModel) => `/repos/${org}/${name}`, [org]);

  return (
    <PageLayout className={classNames(cn['page'], isSafariMobile && cn['no-scroll'])} ref={pageRef}>
      <div className={cn['title']}>
        <Text className={cn['title-top']} color="primary" view="title" maxLines={3}>
          List organization repositories
        </Text>
        <Text className={cn['title-bottom']} color="secondary" view="p-20" maxLines={2}>
          List repositories for specified organization
        </Text>
      </div>
      <Filters initialOrg={org} initialTypes={query.type} onSearch={handleSearch} loading={loading} />
      <RepoList
        list={repoList}
        pagination={repoListStore.pagination}
        onPageChange={handlePageChange}
        getRepoLink={getRepoLink}
        infinite={query.all}
        onSetInfinite={handleShowAll}
        onLoadMore={handleLoadMore}
        loading={loading}
      />
    </PageLayout>
  );
};

export default observer(ReposPage);
