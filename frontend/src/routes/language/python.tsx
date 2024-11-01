import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/python')({
  component: PythonRoute,
})

export default function PythonRoute () {
  return ( <LanguageLandingPage
    languageId={70}
    languageName="Python (2.7.17)"
  /> )
    };