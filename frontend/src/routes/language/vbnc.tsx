import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/vbnc')({
  component: VBNCRoute,
})

export default function VBNCRoute () {
  return ( <LanguageLandingPage
    languageId={84}
    languageName="Visual Basic.Net (vbnc 0.0.0.5943)"
  /> )
    };