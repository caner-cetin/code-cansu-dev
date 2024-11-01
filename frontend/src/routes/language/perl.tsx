import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/perl')({
  component: PerlRoute,
})

export default function PerlRoute () {
  return ( <LanguageLandingPage
    languageId={85}
    languageName="Perl (5.40.0)"
  /> )
    };