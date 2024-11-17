import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/clojure')({
  component: ClojureComponent,
})

function ClojureComponent() {
  return (<LanguageLandingPage
    languageId={86}
    languageName="Clojure (1.11.2)"
  />)
};