import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/nim')({
  component: NimComponent,
})

function NimComponent() {
  useAppStore.getState().setLanguageId(87)
  return <Navigate to="/" />;
}