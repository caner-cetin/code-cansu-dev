import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/c')({
  component: CComponent,
})

function CComponent() {
  useAppStore.getState().setLanguageId(48)
  return <Navigate to="/" />;
}