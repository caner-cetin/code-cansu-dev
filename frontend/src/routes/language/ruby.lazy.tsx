import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/ruby')({
  component: RubyComponent,
})

function RubyComponent() {
  return (<LanguageLandingPage
    languageId={72}
    languageName="Ruby (2.7.0)"
  />)
};