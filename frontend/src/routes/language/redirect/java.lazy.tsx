import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/java')({
  component: JavaComponent,
})

function JavaComponent() {
  useAppStore.getState().setLanguageId(62)
  return <Navigate to="/" />;
}