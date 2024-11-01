import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/php')({
  component: PHPRoute,
})

export default function PHPRoute () {
  return ( <LanguageLandingPage
    languageId={68}
    languageName="PHP (8.3.13)"
  /> )
    };