import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/scala')({
  component: ScalaRoute,
})

export default function ScalaRoute () {
  return ( <LanguageLandingPage
    languageId={81}
    languageName="Scala (3.5.2)"
  /> )
    };