import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/ocaml')({
  component: OCamlComponent,
})

function OCamlComponent() {
  return (<LanguageLandingPage
    languageId={65}
    languageName="OCaml (5.2.0)"
  />)
};