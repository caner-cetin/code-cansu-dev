import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/c')({
  component: CRoute,
})

export default function CRoute() {
  return (<LanguageLandingPage
    languageId={90}
    languageName="C (GCC 13.3)"
  />)
};