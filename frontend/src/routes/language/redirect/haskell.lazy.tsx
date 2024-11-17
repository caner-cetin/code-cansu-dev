import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/haskell')({
  component: HaskellComponent,
})

function HaskellComponent() {
  useAppStore.getState().setLanguageId(61)
  return <Navigate to="/" />;
}