import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/elixir')({
  component: ElixirRoute,
})

export default function ElixirRoute () {
  return ( <LanguageLandingPage
    languageId={57}
    languageName="Elixir (1.17.3)"
  /> )
    };