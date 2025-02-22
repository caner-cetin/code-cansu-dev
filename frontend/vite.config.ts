import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import commonjs from "vite-plugin-commonjs";
import path from "node:path";

export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		TanStackRouterVite(),
		commonjs(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			ace: path.resolve(
				__dirname,
				"node_modules/ace-builds/src-min-noconflict",
			),
		},
	},
	optimizeDeps: {
		include: ["ace-builds"],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					ace: ["ace-builds"],
				},
			},
		},
		manifest: true,
		ssrManifest: true,
	},
	server: {
		port: 5173,
		host: "localhost",
		fs: {
			allow: [".."],
		},
	},
});
