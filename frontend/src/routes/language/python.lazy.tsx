import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/python')({
  component: PythonComponent,
})

function PythonComponent() {
  return (<LanguageLandingPage
    languageId={70}
    languageName="Python (2.7.17)"
  />)
};