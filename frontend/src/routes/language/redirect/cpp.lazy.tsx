import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/cpp')({
  component: CPPComponent,
})

function CPPComponent() {
  useAppStore.getState().setLanguageId(52)
  return <Navigate to="/" />;
}