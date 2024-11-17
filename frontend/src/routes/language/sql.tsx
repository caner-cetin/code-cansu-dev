import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/sql')({
  component: SQLComponent,
})

function SQLComponent() {
  return (<LanguageLandingPage
    languageId={82}
    languageName="SQL (SQLite 3.46.1.1)"
  />)
};