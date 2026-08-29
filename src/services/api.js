import axios from 'axios';
import { serverAddress } from '../settings';

const API = axios.create({
	baseURL: `${serverAddress}/api`,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

API.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		const data = error.response ? error.response.data : "API call error";
		return Promise.reject(data);
	}
)

export default API;