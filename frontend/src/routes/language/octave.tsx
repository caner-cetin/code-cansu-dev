import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/octave')({
  component: OctaveRoute,
})

export default function OctaveRoute () {
  return ( <LanguageLandingPage
    languageId={66}
    languageName="Octave (9.2.0)"
  /> )
    };