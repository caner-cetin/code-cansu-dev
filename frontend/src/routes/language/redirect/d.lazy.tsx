import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/d')({
  component: DComponent,
})

function DComponent() {
  useAppStore.getState().setLanguageId(56)
  return <Navigate to="/" />;
}