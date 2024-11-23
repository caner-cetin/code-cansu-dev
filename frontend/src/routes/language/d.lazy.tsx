import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/d')({
  component: DComponent,
})

function DComponent() {
  return (<LanguageLandingPage
    languageId={56}
    languageName="D (DMD 2.109.1)"
  />)
};