import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/pascal')({
  component: PascalComponent,
})

function PascalComponent() {
  return (<LanguageLandingPage
    languageId={67}
    languageName="Pascal (FPC 3.2.2)"
  />)
};