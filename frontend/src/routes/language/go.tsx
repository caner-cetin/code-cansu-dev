import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/go')({
  component: GoComponent,
})

function GoComponent() {
  return (<LanguageLandingPage
    languageId={60}
    languageName="Go (1.23.2)"
  />)
};