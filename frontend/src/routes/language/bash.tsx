import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/bash')({
  component: BashComponent,
})

function BashComponent() {
  return (<LanguageLandingPage
    languageId={46}
    languageName="Bash (5.0.0)"
  />)
};