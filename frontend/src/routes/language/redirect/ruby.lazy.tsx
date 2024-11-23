import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/ruby')({
  component: RubyComponent,
})

function RubyComponent() {
  useAppStore.getState().setLanguageId(72)
  return <Navigate to="/" />;
}