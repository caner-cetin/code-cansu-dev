import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/javascript')({
  component: JavaScriptComponent,
})

function JavaScriptComponent() {
  useAppStore.getState().setLanguageId(63)
  return <Navigate to="/" />;
}