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
		const errStatus = error.response ? error.response.status : "API call error";
		return Promise.reject(errStatus);
	}
)

export default API;