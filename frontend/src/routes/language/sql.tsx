import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/sql')({
  component: SQLRoute,
})

export default function SQLRoute () {
  return ( <LanguageLandingPage
    languageId={82}
    languageName="SQL (SQLite 3.46.1.1)"
  /> )
    };