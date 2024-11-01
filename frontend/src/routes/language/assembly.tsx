import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/assembly')({
  component: AssemblyRoute,
})

export default function AssemblyRoute() {
  return (<LanguageLandingPage
    languageId={45}
    languageName="Assembly (NASM 2.16.03)"
  />)
};