import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/erlang')({
  component: ErlangComponent,
})

function ErlangComponent() {
  return (<LanguageLandingPage
    languageId={58}
    languageName="Erlang (OTP 27.1.2)"
  />)
};