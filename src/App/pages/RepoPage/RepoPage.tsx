import MarkdownPreview from '@uiw/react-markdown-preview';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import Text from 'components/Text';
import LinkIcon from 'components/icons/LinkIcon';
import { useStore } from 'store/store';
import { FetchStatus } from 'store/types';
import ContributorsList from './components/ContributorsList';
import LanguagesList from './components/LanguagesList';
import RepoStats from './components/RepoStats';
import RepoTitle from './components/RepoTitle';
import TopicList from './components/TopicList';
import cn from './RepoPage.module.scss';

const RepoPage: React.FC = () => {
  const { currentRepo, currentRepoStatus, getCurrentRepo, resetCurrentRepo } = useStore((store) => store.repos);

  const loading = currentRepoStatus === FetchStatus.PENDGING;

  const location = useLocation();

  const locationRepo = useMemo(() => {
    const locationSplit = location.pathname.split('/');
    return { owner: locationSplit[locationSplit.length - 2], name: locationSplit[locationSplit.length - 1] };
  }, [location.pathname]);

  useEffect(() => () => resetCurrentRepo(), [resetCurrentRepo]);

  useEffect(() => {
    if (!currentRepo && currentRepoStatus === FetchStatus.IDLE) {
      getCurrentRepo(locationRepo);
    }
  }, [currentRepo, currentRepoStatus, getCurrentRepo, locationRepo]);

  return (
    <PageLayout className={cn['page']} background="secondary">
      {!loading && currentRepo ? (
        <>
          <RepoTitle avatar={currentRepo.owner.avatar_url} name={currentRepo.name} />
          {currentRepo.homepage && (
            <div className={cn['homepage']}>
              <LinkIcon color="primary" />
              <Link to={currentRepo.homepage} target="_blank">
                <Text view="p-16" weight="bold">
                  {currentRepo.homepage?.split('://')[1]}
                </Text>
              </Link>
            </div>
          )}
          <TopicList topics={currentRepo.topics} />
          <RepoStats
            stars={currentRepo.stargazers_count}
            watching={currentRepo.watchers_count}
            forks={currentRepo.forks_count}
          />
          <div className={cn['bottom-stats']}>
            <ContributorsList list={currentRepo.contributors} />
            <LanguagesList list={currentRepo.languages} />
          </div>
          {currentRepo.readme && (
            <div className={cn['readme-wrap']}>
              <div className={cn['readme-title']}>README.md</div>
              <div className={cn['readme-content']}>
                <MarkdownPreview source={currentRepo.readme} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader className={cn['loader']} size="l" />
      )}
    </PageLayout>
  );
};

export default observer(RepoPage);
