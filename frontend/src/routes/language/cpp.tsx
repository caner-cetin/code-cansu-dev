import React from 'react'
import LanguageLandingPage from 'src/components/LanguageLandingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/cpp')({
  component: CPPRoute,
})

export default function CPPRoute() {
  return <LanguageLandingPage languageId={91} languageName="C++ (GCC 13.3)" />
}
