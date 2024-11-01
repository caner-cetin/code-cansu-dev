import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/bash')({
  component: BashRoute,
})

export default function BashRoute () {
  return ( <LanguageLandingPage
    languageId={46}
    languageName="Bash (5.0.0)"
  /> )
    };