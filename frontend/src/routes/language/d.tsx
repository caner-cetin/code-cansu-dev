import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/d')({
  component: DComponent,
})

function DComponent() {
  return (<LanguageLandingPage
    languageId={56}
    languageName="D (DMD 2.109.1)"
  />)
};