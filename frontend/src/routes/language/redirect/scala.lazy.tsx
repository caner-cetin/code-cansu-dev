import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/scala')({
  component: ScalaComponent,
})

function ScalaComponent() {
  useAppStore.getState().setLanguageId(81)
  return <Navigate to="/" />;
}