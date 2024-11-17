import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/groovy')({
  component: GroovyComponent,
})

function GroovyComponent() {
  useAppStore.getState().setLanguageId(88)
  return <Navigate to="/" />;
}