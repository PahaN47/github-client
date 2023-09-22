import axios from 'axios';
import AXIOS_CONFIG from 'config/axios';

export const axiosInstance = axios.create(AXIOS_CONFIG);
