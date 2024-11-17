import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/kotlin')({
  component: KotlinComponent,
})

function KotlinComponent() {
  return (<LanguageLandingPage
    languageId={78}
    languageName="Kotlin (2.0.21)"
  />)
};