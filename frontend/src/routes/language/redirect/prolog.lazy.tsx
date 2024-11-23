import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/prolog')({
  component: PrologComponent,
})

function PrologComponent() {
  useAppStore.getState().setLanguageId(69)
  return <Navigate to="/" />;
}