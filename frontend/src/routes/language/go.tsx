import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/go')({
  component: GoRoute,
})

export default function GoRoute () {
  return ( <LanguageLandingPage
    languageId={60}
    languageName="Go (1.23.2)"
  /> )
    };