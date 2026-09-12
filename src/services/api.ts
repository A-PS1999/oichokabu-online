import axios, { type AxiosRequestConfig } from 'axios';
import { serverAddress } from '../settings';

export type ApiClient = {
	get: <T = unknown>(url: string, config?: AxiosRequestConfig) => Promise<T>;
	post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
};

const axiosInstance = axios.create({
	baseURL: `${serverAddress}/api`,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		const data = error.response ? error.response.data : 'API call error';
		return Promise.reject(data);
	},
);

const API = axiosInstance as unknown as ApiClient;

export { API };
export default API;
