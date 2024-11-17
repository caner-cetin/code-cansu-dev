import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/javascript')({
  component: JavaScriptComponent,
})

function JavaScriptComponent() {
  return (<LanguageLandingPage
    languageId={63}
    languageName="JavaScript (Bun 1.1.33)"
  />)
};