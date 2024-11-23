import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/erlang')({
  component: ErlangComponent,
})

function ErlangComponent() {
  useAppStore.getState().setLanguageId(58)
  return <Navigate to="/" />;
}