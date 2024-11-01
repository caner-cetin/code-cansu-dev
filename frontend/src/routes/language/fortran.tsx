import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/fortran')({
  component: FortranRoute,
})

export default function FortranRoute () {
  return ( <LanguageLandingPage
    languageId={59}
    languageName="Fortran (GFortran 13.3)"
  /> )
    };