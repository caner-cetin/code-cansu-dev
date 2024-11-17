import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/java')({
  component: JavaComponent,
})

function JavaComponent() {
  return (<LanguageLandingPage
    languageId={62}
    languageName="Java (OpenJDK 23)"
  />)
};