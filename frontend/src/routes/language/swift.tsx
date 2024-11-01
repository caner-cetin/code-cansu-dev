import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/swift')({
  component: SwiftRoute,
})

export default function SwiftRoute () {
  return ( <LanguageLandingPage
    languageId={83}
    languageName="Swift (6.0.1)"
  /> )
    };