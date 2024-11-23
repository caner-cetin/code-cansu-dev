import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/typescript')({
  component: TypeScriptComponent,
})

function TypeScriptComponent() {
  useAppStore.getState().setLanguageId(74)
  return <Navigate to="/" />;
}