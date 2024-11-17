import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/typescript')({
  component: TypeScriptComponent,
})

function TypeScriptComponent() {
  return (<LanguageLandingPage
    languageId={74}
    languageName="TypeScript (Bun 1.1.33)"
  />)
};