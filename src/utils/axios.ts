import axios from 'axios';
import AXIOS_CONFIG from 'config/axios';
import { localStorageKeys } from 'config/localStorage';

const axiosInstance = axios.create(AXIOS_CONFIG);
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(localStorageKeys.USER_TOKEN) ?? process.env.GITHUB_ACCESS_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstance };
