/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URI: string;
	readonly VITE_BACKEND_PORT: string | undefined;
	readonly VITE_BACKEND_PROTOCOL: string | undefined;
	readonly VITE_FRONTEND_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}