import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/prolog')({
  component: PrologRoute,
})

export default function PrologRoute () {
  return ( <LanguageLandingPage
    languageId={69}
    languageName="Prolog (GNU Prolog 1.4.5)"
  /> )
    };