import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/swift')({
  component: SwiftComponent,
})

function SwiftComponent() {
  useAppStore.getState().setLanguageId(83)
  return <Navigate to="/" />;
}