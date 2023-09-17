export type RepoOwner = {
  id: number;
  login: string;
  avatar_url: string;
  public_repos: number;
};

export type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  watchers_count: number;
  stargazers_count: number;
  forks_count: number;
  owner: RepoOwner;
  private: boolean;
  updated_at: string;
  homepage: string;
  topics: string[];
  contributors_url: string;
  languages_url: string;
};

export type GetRepoListProps = {
  org: string;
  page?: number;
};
