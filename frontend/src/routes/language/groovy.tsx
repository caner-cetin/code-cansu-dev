import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/groovy')({
  component: GroovyComponent,
})

function GroovyComponent() {
  return (<LanguageLandingPage
    languageId={88}
    languageName="Groovy (4.0.23)"
  />)
};