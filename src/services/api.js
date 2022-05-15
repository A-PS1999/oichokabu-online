import axios from 'axios';
import { serverAddress } from '../settings';

const API = axios.create({
	baseURL: `${serverAddress}/api`,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

export default API;