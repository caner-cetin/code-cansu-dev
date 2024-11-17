import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/objectivec')({
  component: ObjectiveCComponent,
})

function ObjectiveCComponent() {
  return (<LanguageLandingPage
    languageId={79}
    languageName="Objective-C (Clang 7.0.1)"
  />)
};