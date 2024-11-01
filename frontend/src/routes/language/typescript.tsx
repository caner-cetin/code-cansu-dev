import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/typescript')({
  component: TypeScriptRoute,
})

export default function TypeScriptRoute () {
  return ( <LanguageLandingPage
    languageId={74}
    languageName="TypeScript (Bun 1.1.33)"
  /> )
    };