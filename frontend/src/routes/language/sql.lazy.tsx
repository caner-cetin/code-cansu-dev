import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/sql')({
  component: SQLComponent,
})

function SQLComponent() {
  return (<LanguageLandingPage
    languageId={82}
    languageName="SQL (SQLite 3.46.1.1)"
  />)
};