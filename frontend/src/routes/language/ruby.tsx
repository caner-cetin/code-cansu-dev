import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/ruby')({
  component: RubyRoute,
})

export default function RubyRoute () {
  return ( <LanguageLandingPage
    languageId={72}
    languageName="Ruby (2.7.0)"
  /> )
    };