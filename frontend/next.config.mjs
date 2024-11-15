import path from "node:path";
import { fileURLToPath } from "node:url";
// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filesNeedToExcludeMinifying = [
	"src/scripts/live2d.min.js",
	"src/scripts/waifu-tips.js",
];

const filesPathToExcludeMinifying = filesNeedToExcludeMinifying.map((src) => {
	return fileURLToPath(new URL(src, import.meta.url));
});

const nextConfig = {
	webpack: (config, { isServer }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./src"),
			ace: path.resolve(
				__dirname,
				"node_modules/ace-builds/src-min-noconflict",
			),
		};
		config.optimization.minimizer = config.optimization.minimizer.map(
			(plugin) => {
				if (plugin.constructor.name === "TerserPlugin") {
					plugin.options.exclude = filesPathToExcludeMinifying;
				}
				return plugin;
			},
		);
		return config;
	},
	output: 'export',
	images: {
		unoptimized: true
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: false,
	transpilePackages: ['ace-builds'],
};

export default nextConfig;