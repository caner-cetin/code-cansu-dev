import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/kotlin')({
  component: KotlinComponent,
})

function KotlinComponent() {
  return (<LanguageLandingPage
    languageId={78}
    languageName="Kotlin (2.0.21)"
  />)
};