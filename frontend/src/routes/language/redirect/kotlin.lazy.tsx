import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/kotlin')({
  component: KotlinComponent,
})

function KotlinComponent() {
  useAppStore.getState().setLanguageId(78)
  return <Navigate to="/" />;
}