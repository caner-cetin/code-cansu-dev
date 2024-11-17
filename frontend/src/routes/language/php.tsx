import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/php')({
  component: PHPComponent,
})

function PHPComponent() {
  return (<LanguageLandingPage
    languageId={68}
    languageName="PHP (8.3.13)"
  />)
};