import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/objectivec')({
  component: ObjectiveCComponent,
})

function ObjectiveCComponent() {
  return (<LanguageLandingPage
    languageId={79}
    languageName="Objective-C (Clang 7.0.1)"
  />)
};