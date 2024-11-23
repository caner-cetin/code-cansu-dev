import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/go')({
  component: GoComponent,
})

function GoComponent() {
  useAppStore.getState().setLanguageId(60)
  return <Navigate to="/" />;
}