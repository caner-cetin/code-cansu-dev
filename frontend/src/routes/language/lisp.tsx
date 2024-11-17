import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/lisp')({
  component: LispComponent,
})

function LispComponent() {
  return (<LanguageLandingPage
    languageId={55}
    languageName="Common Lisp (SBCL 2.4.9)"
  />)
};