import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/swift')({
  component: SwiftComponent,
})

function SwiftComponent() {
  return (<LanguageLandingPage
    languageId={83}
    languageName="Swift (6.0.1)"
  />)
};