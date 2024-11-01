import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/lisp')({
  component: LispRoute,
})

export default function LispRoute () {
  return ( <LanguageLandingPage
    languageId={55}
    languageName="Common Lisp (SBCL 2.4.9)"
  /> )
    };