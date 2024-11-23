import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/pascal')({
  component: PascalComponent,
})

function PascalComponent() {
  useAppStore.getState().setLanguageId(67)
  return <Navigate to="/" />;
}