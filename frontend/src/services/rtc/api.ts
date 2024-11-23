import axios, { type AxiosError } from "axios";
import toast from "react-hot-toast";
const signallerApi = axios.create({
	baseURL: `${import.meta.env.VITE_RTC_SIGNALLER_BACKEND_PROTOCOL ?? "http"}://${import.meta.env.VITE_RTC_SIGNALLER_BACKEND_URI}:${import.meta.env.VITE_RTC_SIGNALLER_BACKEND_PORT ?? ""}`,
});

signallerApi.interceptors.response.use(
	(response) => response,
	async (error: Error | AxiosError) => {
		if (axios.isAxiosError(error)) {
			const response = error.response;
			if (!response) {
				return Promise.reject(error);
			}
			toast.error(response.data.message);
		}
		return Promise.reject(error);
	},
);

export default signallerApi;
