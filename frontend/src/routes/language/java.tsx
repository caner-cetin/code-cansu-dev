import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/java')({
  component: JavaRoute,
})

export default function JavaRoute () {
  return ( <LanguageLandingPage
    languageId={62}
    languageName="Java (OpenJDK 23)"
  /> )
    };