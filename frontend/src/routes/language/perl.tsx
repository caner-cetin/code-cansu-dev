import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/perl')({
  component: PerlComponent,
})

function PerlComponent() {
  return (<LanguageLandingPage
    languageId={85}
    languageName="Perl (5.40.0)"
  />)
};