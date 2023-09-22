export type RepoOwnerApi = {
  id: number;
  login: string;
  avatar_url: string;
};

export type RepoOwnerModel = {
  id: number;
  login: string;
  avatarUrl: string;
};

export const normalizeRepoOwner = (from: RepoOwnerApi): RepoOwnerModel => ({
  id: from.id,
  login: from.login,
  avatarUrl: from.avatar_url,
});
