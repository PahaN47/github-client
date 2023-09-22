import { normalizeRepoOwner, RepoOwnerApi, RepoOwnerModel } from './repoOwner';

export type RepoApi = {
  id: number;
  name: string;
  description: string;
  url: string;
  watchers_count: number;
  stargazers_count: number;
  forks_count: number;
  owner: RepoOwnerApi;
  private: boolean;
  updated_at: string;
  homepage: string;
  topics: string[];
};

export type RepoModel = {
  id: number;
  name: string;
  description: string;
  url: string;
  watchersCount: number;
  stargazersCount: number;
  forksCount: number;
  owner: RepoOwnerModel;
  private: boolean;
  updatedAt: Date;
  homepage: string;
  topics: string[];
};

export const normalizeRepo = (from: RepoApi): RepoModel => ({
  id: from.id,
  name: from.name,
  description: from.description,
  url: from.url,
  watchersCount: from.watchers_count,
  stargazersCount: from.stargazers_count,
  forksCount: from.forks_count,
  owner: normalizeRepoOwner(from.owner),
  private: from.private,
  updatedAt: new Date(from.updated_at),
  homepage: from.homepage,
  topics: from.topics,
});
