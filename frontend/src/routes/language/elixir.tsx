import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/elixir')({
  component: ElixirComponent,
})

function ElixirComponent() {
  return (<LanguageLandingPage
    languageId={57}
    languageName="Elixir (1.17.3)"
  />)
};