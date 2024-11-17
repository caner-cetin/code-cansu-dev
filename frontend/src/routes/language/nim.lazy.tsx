import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/nim')({
  component: NimComponent,
})

function NimComponent() {
  return (<LanguageLandingPage
    languageId={87}
    languageName="Nim (2.2.0)"
  />)
};