import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/cpp')({
  component: CPPComponent,
})

function CPPComponent() {
  return (<LanguageLandingPage
    languageId={52}
    languageName="C++ (GCC 10.2)"
  />)
};