import MarkdownPreview from '@uiw/react-markdown-preview';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import { useStore } from 'store/store';
import { FetchStatus } from 'store/types';
import ContributorsList from './components/ContributorsList';
import LanguagesList from './components/LanguagesList';
import RepoHomeLink from './components/RepoHomeLink';
import RepoStats from './components/RepoStats';
import RepoTitle from './components/RepoTitle';
import TopicList from './components/TopicList';
import cn from './RepoPage.module.scss';

const RepoPage: React.FC = () => {
  const { currentRepo, currentRepoStatus, getCurrentRepo, resetCurrentRepo } = useStore((store) => store.currentRepo);

  const loading = currentRepoStatus === FetchStatus.PENDGING;
  const { owner, name } = useParams();

  useEffect(() => () => resetCurrentRepo(), [resetCurrentRepo]);

  useEffect(() => {
    if (currentRepoStatus === FetchStatus.IDLE) {
      getCurrentRepo({ owner: owner ?? '', name: name ?? '' });
    }
  }, [currentRepo, currentRepoStatus, getCurrentRepo, name, owner]);

  return (
    <PageLayout className={cn['page']} background="secondary">
      {!loading && currentRepo ? (
        <>
          <RepoTitle avatar={currentRepo.owner.avatar_url} name={currentRepo.name} />
          {currentRepo.homepage && <RepoHomeLink url={currentRepo.homepage} />}
          <TopicList topics={currentRepo.topics} />
          <RepoStats
            stars={currentRepo.stargazers_count}
            watching={currentRepo.watchers_count}
            forks={currentRepo.forks_count}
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
