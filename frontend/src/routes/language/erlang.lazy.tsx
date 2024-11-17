import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/erlang')({
  component: ErlangComponent,
})

function ErlangComponent() {
  return (<LanguageLandingPage
    languageId={58}
    languageName="Erlang (OTP 27.1.2)"
  />)
};