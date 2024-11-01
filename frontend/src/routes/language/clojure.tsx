import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/clojure')({
  component: ClojureRoute,
})

export default function ClojureRoute () {
  return ( <LanguageLandingPage
    languageId={86}
    languageName="Clojure (1.11.2)"
  /> )
    };