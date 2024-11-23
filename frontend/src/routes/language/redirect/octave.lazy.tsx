import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/octave')({
  component: OctaveComponent,
})

function OctaveComponent() {
  useAppStore.getState().setLanguageId(66)
  return <Navigate to="/" />;
}