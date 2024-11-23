import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/elixir')({
  component: ElixirComponent,
})

function ElixirComponent() {
  useAppStore.getState().setLanguageId(57)
  return <Navigate to="/" />;
}