export type RepoType = 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member';

export type GetRepoListProps = {
  org: string;
  page?: number;
  types: RepoType[];
};

export type AddReposProps = Pick<GetRepoListProps, 'org' | 'types'>;
