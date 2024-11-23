import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/r')({
  component: RComponent,
})

function RComponent() {
  useAppStore.getState().setLanguageId(80)
  return <Navigate to="/" />;
}