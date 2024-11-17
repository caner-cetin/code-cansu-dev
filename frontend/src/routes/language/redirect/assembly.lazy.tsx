import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/assembly')({
  component: AssemblyComponent,
})

function AssemblyComponent() {
  useAppStore.getState().setLanguageId(45)
  return <Navigate to="/" />;
}