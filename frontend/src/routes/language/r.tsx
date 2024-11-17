import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/r')({
  component: RComponent,
})

function RComponent() {
  return (<LanguageLandingPage
    languageId={80}
    languageName="R (4.4.1)"
  />)
};