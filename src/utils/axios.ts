import axios from 'axios';
import AXIOS_CONFIG from 'config/axios';

const axiosInstance = axios.create(AXIOS_CONFIG);

export default axiosInstance;
