export type RepoOwnerShort = {
  id: number;
  login: string;
  avatar_url: string;
};

export type RepoOwner = RepoOwnerShort & {
  public_repos: number;
};

export type Contributor = {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
};

export type Readme = {
  content: string;
};

export type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  watchers_count: number;
  stargazers_count: number;
  forks_count: number;
  owner: RepoOwnerShort;
  private: boolean;
  updated_at: string;
  homepage: string;
  topics: string[];
  contributors_url: string;
  languages_url: string;
};

export type CurrentRepo = Repo & {
  contributors: Contributor[];
  languages: Record<string, number>;
  readme?: string;
};

export type GetRepoListProps = {
  org: string;
  page?: number;
};

export type GetCurrentRepoProps = {
  owner: string;
  name: string;
};
