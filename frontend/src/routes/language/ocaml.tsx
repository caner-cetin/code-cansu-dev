import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/ocaml')({
  component: OCamlComponent,
})

function OCamlComponent() {
  return (<LanguageLandingPage
    languageId={65}
    languageName="OCaml (5.2.0)"
  />)
};