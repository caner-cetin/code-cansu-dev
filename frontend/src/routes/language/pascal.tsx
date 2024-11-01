import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/pascal')({
  component: PascalRoute,
})

export default function PascalRoute () {
  return ( <LanguageLandingPage
    languageId={67}
    languageName="Pascal (FPC 3.2.2)"
  /> )
    };