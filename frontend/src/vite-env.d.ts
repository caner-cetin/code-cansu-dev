/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URI: string;
	readonly VITE_BACKEND_PORT: string | undefined;
	readonly VITE_BACKEND_PROTOCOL: string | undefined;
	readonly VITE_FRONTEND_URI: string;
	readonly VITE_RTC_SIGNALLER_BACKEND_PROTOCOL: string;
	readonly VITE_RTC_SIGNALLER_BACKEND_URI: string;
	readonly VITE_RTC_SIGNALLER_BACKEND_PORT: string;
	readonly VITE_RTC_PLANE_PROXY_URI: string;
	readonly VITE_RTC_PLANE_PROXY_PORT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}