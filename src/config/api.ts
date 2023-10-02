export const API_ENDPOINTS = {
  LOGIN: (clientId?: string) => {
    const url = process.env.URL;
    if (!url || !clientId) {
      return '.';
    }
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${url}&prompt=consent`;
  },
  AUTH: (code: string) => `${process.env.AUTH_DEPLOY}/authenticate/${code}`,
  AUTH_USER: '/user',
  ORG: (org: string) => ({
    index: `/orgs/${org}`,
    REPOS: `/orgs/${org}/repos`,
  }),
  REPO: (owner: string, name: string) => ({
    index: `/repos/${owner}/${name}`,
    README: `/repos/${owner}/${name}/readme`,
  }),
  USER: (user: string) => `/users/${user}`,
};
