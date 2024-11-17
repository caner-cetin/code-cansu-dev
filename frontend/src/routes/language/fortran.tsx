import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/fortran')({
  component: FortranComponent,
})

function FortranComponent() {
  return (<LanguageLandingPage
    languageId={59}
    languageName="Fortran (GFortran 13.3)"
  />)
};