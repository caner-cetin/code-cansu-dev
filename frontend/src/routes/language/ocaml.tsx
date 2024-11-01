import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/ocaml')({
  component: OCamlRoute,
})

export default function OCamlRoute () {
  return ( <LanguageLandingPage
    languageId={65}
    languageName="OCaml (5.2.0)"
  /> )
    };