/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URI: string;
	readonly VITE_BACKEND_PORT: string | undefined;
	readonly VITE_BACKEND_PROTOCOL: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}