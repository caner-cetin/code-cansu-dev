/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URI: string;
	readonly VITE_FRONTEND_URI: string;
	readonly VITE_DRONE_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}