import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/ruby')({
  component: RubyComponent,
})

function RubyComponent() {
  return (<LanguageLandingPage
    languageId={72}
    languageName="Ruby (2.7.0)"
  />)
};