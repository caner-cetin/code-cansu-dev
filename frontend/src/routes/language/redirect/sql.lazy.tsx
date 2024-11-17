import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/sql')({
  component: SQLComponent,
})

function SQLComponent() {
  useAppStore.getState().setLanguageId(82)
  return <Navigate to="/" />;
}