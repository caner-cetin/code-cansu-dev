import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/scala')({
  component: ScalaComponent,
})

function ScalaComponent() {
  return (<LanguageLandingPage
    languageId={81}
    languageName="Scala (3.5.2)"
  />)
};