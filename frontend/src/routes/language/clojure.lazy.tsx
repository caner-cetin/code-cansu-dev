import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/clojure')({
  component: ClojureComponent,
})

function ClojureComponent() {
  return (<LanguageLandingPage
    languageId={86}
    languageName="Clojure (1.11.2)"
  />)
};