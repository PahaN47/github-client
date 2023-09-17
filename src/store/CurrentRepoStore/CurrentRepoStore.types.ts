export type RepoOwner = {
  id: number;
  login: string;
  avatar_url: string;
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

export type Language = {
  name: string;
  value: string;
  color: string;
};

export type CurrentRepo = {
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
  contributors: Contributor[];
  contributorsCount: number;
  languages: Language[];
  readme?: string;
};

export type GetCurrentRepoProps = {
  owner: string;
  name: string;
};
