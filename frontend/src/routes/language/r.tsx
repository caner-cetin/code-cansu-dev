import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/r')({
  component: RRoute,
})

export default function RRoute () {
  return ( <LanguageLandingPage
    languageId={80}
    languageName="R (4.4.1)"
  /> )
    };