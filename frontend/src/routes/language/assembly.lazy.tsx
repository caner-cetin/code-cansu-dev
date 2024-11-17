import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/assembly')({
  component: AssemblyComponent,
})

function AssemblyComponent() {
  return (<LanguageLandingPage
    languageId={45}
    languageName="Assembly (NASM 2.16.03)"
  />)
};