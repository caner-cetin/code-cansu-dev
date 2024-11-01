import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/objective-c')({
  component: ObjectiveCRoute,
})

export default function ObjectiveCRoute() {
  return (<LanguageLandingPage
    languageId={79}
    languageName="Objective-C (Clang 7.0.1)"
  />)
};