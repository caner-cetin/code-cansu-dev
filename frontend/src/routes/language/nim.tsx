import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/nim')({
  component: NimRoute,
})

export default function NimRoute () {
  return ( <LanguageLandingPage
    languageId={87}
    languageName="Nim (2.2.0)"
  /> )
    };