import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/cobol')({
  component: COBOLRoute,
})

export default function COBOLRoute () {
  return ( <LanguageLandingPage
    languageId={77}
    languageName="COBOL (GnuCOBOL 3.1.2)"
  /> )
    };