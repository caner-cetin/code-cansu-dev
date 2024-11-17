import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/scala')({
  component: ScalaComponent,
})

function ScalaComponent() {
  return (<LanguageLandingPage
    languageId={81}
    languageName="Scala (3.5.2)"
  />)
};