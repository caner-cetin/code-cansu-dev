import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/erlang')({
  component: ErlangRoute,
})

export default function ErlangRoute () {
  return ( <LanguageLandingPage
    languageId={58}
    languageName="Erlang (OTP 27.1.2)"
  /> )
    };