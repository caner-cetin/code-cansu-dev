import { LANGUAGE_CONFIG } from "../config/languages";

import fs from "node:fs";
import path from "node:path";

const generateLanguageRoutes = () => {
	const uniqueLanguages = new Set();
	const filteredLanguages = Object.entries(LANGUAGE_CONFIG).filter(
		([_, lang]) => {
			if (uniqueLanguages.has(lang.languageName.toLowerCase())) {
				return false;
			}
			uniqueLanguages.add(lang.languageName.toLowerCase());
			return true;
		},
	);

	let markdown = "## supported languages \n\n";

	for (const [_, lang] of filteredLanguages) {
		markdown += `* [${lang.runnerName}](https://code.cansu.dev/language/redirect/${lang.languageName.toLowerCase()})\n`;
	}
	fs.writeFileSync(path.join(__dirname, "language.md"), markdown.trim());
};

generateLanguageRoutes();
