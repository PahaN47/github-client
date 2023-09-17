export const API_ENDPOINTS = {
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
