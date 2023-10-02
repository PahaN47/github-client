export type AuthUserApi = {
  id: number;
  login: string;
  avatar_url: string;
};

export type AuthUserModel = {
  id: number;
  login: string;
  avatarUrl: string;
};

export const normalizeAuthUser = (from: AuthUserApi): AuthUserModel => ({
  id: from.id,
  login: from.login,
  avatarUrl: from.avatar_url,
});
