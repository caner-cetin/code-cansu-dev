import axios, { type AxiosError } from "axios";
import toast from "react-hot-toast";
const api = axios.create({
	baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
});

api.interceptors.response.use(
	(response) => response,
	async (error: Error | AxiosError) => {
		if (axios.isAxiosError(error)) {
			const response = error.response;
			if (!response) {
				return Promise.reject(error);
			}
			toast.error(response.data);
		}
		return Promise.reject(error);
	},
);

export default api;
