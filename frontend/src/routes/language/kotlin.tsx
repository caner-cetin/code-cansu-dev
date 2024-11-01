import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/kotlin')({
  component: KotlinRoute,
})

export default function KotlinRoute () {
  return ( <LanguageLandingPage
    languageId={78}
    languageName="Kotlin (2.0.21)"
  /> )
    };