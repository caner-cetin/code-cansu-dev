import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/haskell')({
  component: HaskellComponent,
})

function HaskellComponent() {
  return (<LanguageLandingPage
    languageId={61}
    languageName="Haskell (7.8.4)"
  />)
};