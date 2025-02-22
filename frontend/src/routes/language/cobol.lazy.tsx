import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/cobol')({
  component: COBOLComponent,
})

function COBOLComponent() {
  return (<LanguageLandingPage
    languageId={77}
    languageName="COBOL (GnuCOBOL 3.1.2)"
  />)
};