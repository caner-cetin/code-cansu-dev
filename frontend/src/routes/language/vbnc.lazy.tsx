import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/vbnc')({
  component: VBNCComponent,
})

function VBNCComponent() {
  return (<LanguageLandingPage
    languageId={84}
    languageName="Visual Basic.Net (vbnc 0.0.0.5943)"
  />)
};