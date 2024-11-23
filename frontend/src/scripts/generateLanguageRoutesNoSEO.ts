import { LANGUAGE_CONFIG } from "../config/languages";

import fs from "node:fs";
import path from "node:path";

const languageDir = path.join(".", "language");

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

	for (const [id, lang] of filteredLanguages) {
		const filePath = path.join(
			languageDir,
			`${lang.languageName.toLowerCase()}.lazy.tsx`,
		);

		// Ensure the language directory exists
		if (!fs.existsSync(languageDir)) {
			fs.mkdirSync(languageDir, { recursive: true });
		}

		const fileContent = `
import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/${lang.languageName.toLowerCase()}')({
  component: ${lang.languageName}Component,
})

function ${lang.languageName}Component() {
  useAppStore.getState().setLanguageId(${Number(id)})
  return <Navigate to="/" />;
}
      `;

		fs.writeFileSync(filePath, fileContent.trim());
	}
};

generateLanguageRoutes();
