import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/cpp')({
  component: CPPComponent,
})

function CPPComponent() {
  return (<LanguageLandingPage
    languageId={52}
    languageName="C++ (GCC 10.2)"
  />)
};