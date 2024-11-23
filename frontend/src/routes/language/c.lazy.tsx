import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/c')({
  component: CComponent,
})

function CComponent() {
  return (<LanguageLandingPage
    languageId={48}
    languageName="C (GCC 7.4.0)"
  />)
};