import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/groovy')({
  component: GroovyRoute,
})

export default function GroovyRoute () {
  return ( <LanguageLandingPage
    languageId={88}
    languageName="Groovy (4.0.23)"
  /> )
    };