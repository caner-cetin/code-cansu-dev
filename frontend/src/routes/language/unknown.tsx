import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/unknown')({
  component: UnknownComponent,
})

function UnknownComponent() {
  return (<LanguageLandingPage
    languageId={999}
    languageName="Unknown"
  />)
};