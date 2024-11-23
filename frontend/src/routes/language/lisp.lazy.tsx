import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/lisp')({
  component: LispComponent,
})

function LispComponent() {
  return (<LanguageLandingPage
    languageId={55}
    languageName="Common Lisp (SBCL 2.4.9)"
  />)
};