import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/java')({
  component: JavaComponent,
})

function JavaComponent() {
  return (<LanguageLandingPage
    languageId={62}
    languageName="Java (OpenJDK 23)"
  />)
};