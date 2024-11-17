import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/python')({
  component: PythonComponent,
})

function PythonComponent() {
  return (<LanguageLandingPage
    languageId={70}
    languageName="Python (2.7.17)"
  />)
};