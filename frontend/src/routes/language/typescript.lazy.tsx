import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/typescript')({
  component: TypeScriptComponent,
})

function TypeScriptComponent() {
  return (<LanguageLandingPage
    languageId={74}
    languageName="TypeScript (Bun 1.1.33)"
  />)
};