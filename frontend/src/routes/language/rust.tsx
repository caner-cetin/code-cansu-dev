import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/rust')({
  component: RustComponent,
})

function RustComponent() {
  return (<LanguageLandingPage
    languageId={73}
    languageName="Rust (1.82.0)"
  />)
};