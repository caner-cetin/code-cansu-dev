import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/haskell')({
  component: HaskellComponent,
})

function HaskellComponent() {
  return (<LanguageLandingPage
    languageId={61}
    languageName="Haskell (7.8.4)"
  />)
};