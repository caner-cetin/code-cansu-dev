import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/octave')({
  component: OctaveComponent,
})

function OctaveComponent() {
  return (<LanguageLandingPage
    languageId={66}
    languageName="Octave (9.2.0)"
  />)
};