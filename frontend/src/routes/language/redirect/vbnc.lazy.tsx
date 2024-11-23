import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/vbnc')({
  component: VBNCComponent,
})

function VBNCComponent() {
  useAppStore.getState().setLanguageId(84)
  return <Navigate to="/" />;
}