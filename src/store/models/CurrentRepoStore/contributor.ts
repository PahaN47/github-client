export type ContributorApi = {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
};

export type ContributorModel = {
  id: number;
  login: string;
  avatarUrl: string;
  name: string;
};

export const normalizeContributor = (from: ContributorApi): ContributorModel => ({
  id: from.id,
  login: from.login,
  avatarUrl: from.avatar_url,
  name: from.name,
});
