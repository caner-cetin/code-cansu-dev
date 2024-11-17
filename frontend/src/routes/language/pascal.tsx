import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/pascal')({
  component: PascalComponent,
})

function PascalComponent() {
  return (<LanguageLandingPage
    languageId={67}
    languageName="Pascal (FPC 3.2.2)"
  />)
};