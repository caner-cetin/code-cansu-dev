import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/rust')({
  component: RustRoute,
})

export default function RustRoute () {
  return ( <LanguageLandingPage
    languageId={73}
    languageName="Rust (1.82.0)"
  /> )
    };