import MarkdownPreview from '@uiw/react-markdown-preview';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    currentRepoStore.getCurrentRepo({ owner: owner ?? '', name: name ?? '' });
  }, [owner, name]);

  useEffect(
    action(() => {
      const currentRepo = currentRepoStore.currentRepo;

      return () => {
        if (currentRepo) {
          lastSeenRepos.addRepo(currentRepo);
        }
      };
    }),
    [currentRepoStore.currentRepo],
  );

  return (
    <PageLayout className={cn['page']} background="secondary">
      {!loading && currentRepoStore.currentRepo ? (
        <>
          <RepoTitle avatar={currentRepoStore.currentRepo.owner.avatarUrl} name={currentRepoStore.currentRepo.name} />
          {currentRepoStore.currentRepo.homepage && <RepoHomeLink url={currentRepoStore.currentRepo.homepage} />}
          <TopicList topics={currentRepoStore.currentRepo.topics} />
          <RepoStats
            stars={currentRepoStore.currentRepo.stargazersCount}
            watching={currentRepoStore.currentRepo.watchersCount}
            forks={currentRepoStore.currentRepo.forksCount}
          />
          <div className={cn['bottom-stats']}>
            <ContributorsList
              list={currentRepoStore.currentRepo.contributors}
              count={currentRepoStore.currentRepo.contributorsCount}
            />
            <LanguagesList list={currentRepoStore.currentRepo.languages} />
          </div>
          {currentRepoStore.currentRepo.readme && (
            <div className={cn['readme-wrap']}>
              <div className={cn['readme-title']}>README.md</div>
              <div className={cn['readme-content']}>
                <MarkdownPreview source={currentRepoStore.currentRepo.readme} />
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
