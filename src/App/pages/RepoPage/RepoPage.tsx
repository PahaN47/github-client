import MarkdownPreview from '@uiw/react-markdown-preview';
import { observer } from 'mobx-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import CurrentRepoStore from 'store/CurrentRepoStore';
import { FetchStatus } from 'store/types';
import { useLocalStore } from 'utils/hooks';
import { useInitialAction } from 'utils/hooks/useInitialAction';
import ContributorsList from './components/ContributorsList';
import LanguagesList from './components/LanguagesList';
import RepoHomeLink from './components/RepoHomeLink';
import RepoStats from './components/RepoStats';
import RepoTitle from './components/RepoTitle';
import TopicList from './components/TopicList';
import cn from './RepoPage.module.scss';

const RepoPage: React.FC = () => {
  const { currentRepo, currentRepoStatus, getCurrentRepo } = useLocalStore(() => new CurrentRepoStore());

  const loading = currentRepoStatus === FetchStatus.PENDGING;
  const { owner, name } = useParams();

  useInitialAction(() => {
    getCurrentRepo({ owner: owner ?? '', name: name ?? '' });
  });

  return (
    <PageLayout className={cn['page']} background="secondary">
      {!loading && currentRepo ? (
        <>
          <RepoTitle avatar={currentRepo.owner.avatarUrl} name={currentRepo.name} />
          {currentRepo.homepage && <RepoHomeLink url={currentRepo.homepage} />}
          <TopicList topics={currentRepo.topics} />
          <RepoStats
            stars={currentRepo.stargazersCount}
            watching={currentRepo.watchersCount}
            forks={currentRepo.forksCount}
          />
          <div className={cn['bottom-stats']}>
            <ContributorsList list={currentRepo.contributors} count={currentRepo.contributorsCount} />
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
