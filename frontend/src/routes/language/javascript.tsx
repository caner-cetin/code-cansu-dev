import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/javascript')({
  component: JavaScriptRoute,
})

export default function JavaScriptRoute () {
  return ( <LanguageLandingPage
    languageId={63}
    languageName="JavaScript (Bun 1.1.33)"
  /> )
    };