import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/prolog')({
  component: PrologComponent,
})

function PrologComponent() {
  return (<LanguageLandingPage
    languageId={69}
    languageName="Prolog (GNU Prolog 1.4.5)"
  />)
};