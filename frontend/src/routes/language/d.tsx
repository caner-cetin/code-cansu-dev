import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/d')({
  component: DRoute,
})

export default function DRoute () {
  return ( <LanguageLandingPage
    languageId={56}
    languageName="D (DMD 2.109.1)"
  /> )
    };