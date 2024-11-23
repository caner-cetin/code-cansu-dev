import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/swift')({
  component: SwiftComponent,
})

function SwiftComponent() {
  return (<LanguageLandingPage
    languageId={83}
    languageName="Swift (6.0.1)"
  />)
};