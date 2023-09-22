import CollectionStore from 'store/CollectionStore';
import { RepoOwnerApi, RepoOwnerModel, normalizeRepoOwner } from '../RepoListStore';
import { ContributorModel } from './contributor';
import { LanguageModel } from './language';

export type CurrentRepoApi = {
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
  contributors_url: string;
  languages_url: string;
};

export type CurrentRepoModel = {
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
  contributorsUrl: string;
  languagesUrl: string;
  contributors: CollectionStore<number, ContributorModel>;
  contributorsCount: number;
  languages: CollectionStore<string, LanguageModel>;
  readme: string;
};

export const normalizeCurrentRepo = (from: CurrentRepoApi): CurrentRepoModel => ({
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
  contributorsUrl: from.contributors_url,
  languagesUrl: from.languages_url,
  contributors: new CollectionStore<number, ContributorModel>([], 'id'),
  contributorsCount: 0,
  languages: new CollectionStore<string, LanguageModel>([], 'name'),
  readme: '',
});
