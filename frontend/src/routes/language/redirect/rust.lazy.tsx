import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/rust')({
  component: RustComponent,
})

function RustComponent() {
  useAppStore.getState().setLanguageId(73)
  return <Navigate to="/" />;
}