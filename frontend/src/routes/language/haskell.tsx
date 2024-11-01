import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/haskell')({
  component: HaskellRoute,
})

export default function HaskellRoute () {
  return ( <LanguageLandingPage
    languageId={61}
    languageName="Haskell (7.8.4)"
  /> )
    };