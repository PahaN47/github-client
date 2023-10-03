import MarkdownPreview, { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Loader from 'components/Loader';
import PageLayout from 'components/PageLayout';
import CurrentRepoStore from 'store/CurrentRepoStore';
import { useLastSeenRepos, useLocalStore } from 'utils/hooks';
import ContributorsList from './components/ContributorsList';
import LanguagesList from './components/LanguagesList';
import RepoHomeLink from './components/RepoHomeLink';
import RepoStats from './components/RepoStats';
import RepoTitle from './components/RepoTitle';
import TopicList from './components/TopicList';
import cn from './RepoPage.module.scss';

const RepoPage: React.FC = () => {
  const { owner, name } = useParams();
  const lastSeenRepos = useLastSeenRepos();

  const currentRepoStore = useLocalStore(() => new CurrentRepoStore());

  const loading = currentRepoStore.status.isPending;

  const contributors = useMemo(
    () => (currentRepoStore.currentRepo ? Object.values(currentRepoStore.currentRepo.contributors.entities) : []),
    [currentRepoStore.currentRepo],
  );

  const languages = useMemo(
    () => (currentRepoStore.currentRepo ? Object.values(currentRepoStore.currentRepo.languages.entities) : []),
    [currentRepoStore.currentRepo],
  );

  const markdownProps = useMemo<MarkdownPreviewProps['wrapperElement']>(() => ({ 'data-color-mode': 'light' }), []);

  useEffect(() => {
    currentRepoStore.getCurrentRepo({ owner: owner ?? '', name: name ?? '' });
  }, [owner, name]);

  useEffect(() => {
    const currentRepo = currentRepoStore.currentRepo;

    return () => {
      if (currentRepo) {
        lastSeenRepos.addRepo(currentRepo);
      }
    };
  }, [currentRepoStore.currentRepo]);

  return (
    <PageLayout className={cn['page']} background="secondary">
      {!loading && currentRepoStore.currentRepo ? (
        <>
          <RepoTitle avatar={currentRepoStore.currentRepo.owner.avatarUrl} name={currentRepoStore.currentRepo.name} />
          {currentRepoStore.currentRepo.homepage && <RepoHomeLink url={currentRepoStore.currentRepo.homepage} />}
          {!!currentRepoStore.currentRepo.topics.length && <TopicList topics={currentRepoStore.currentRepo.topics} />}
          <RepoStats
            stars={currentRepoStore.currentRepo.stargazersCount}
            watching={currentRepoStore.currentRepo.watchersCount}
            forks={currentRepoStore.currentRepo.forksCount}
          />
          <div className={cn['bottom-stats']}>
            <ContributorsList list={contributors} count={currentRepoStore.currentRepo.contributorsCount} />
            <LanguagesList list={languages} />
          </div>
          {currentRepoStore.currentRepo.readme && (
            <div className={cn['readme-wrap']}>
              <div className={cn['readme-title']}>README.md</div>
              <div className={cn['readme-content']}>
                <MarkdownPreview source={currentRepoStore.currentRepo.readme} wrapperElement={markdownProps} />
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
