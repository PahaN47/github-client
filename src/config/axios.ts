import { CreateAxiosDefaults } from 'axios';

const AXIOS_CONFIG: CreateAxiosDefaults = {
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
  paramsSerializer: { indexes: null },
};

export default AXIOS_CONFIG;
