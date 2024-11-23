import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/fortran')({
  component: FortranComponent,
})

function FortranComponent() {
  useAppStore.getState().setLanguageId(59)
  return <Navigate to="/" />;
}