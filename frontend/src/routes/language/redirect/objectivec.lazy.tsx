import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/objectivec')({
  component: ObjectiveCComponent,
})

function ObjectiveCComponent() {
  useAppStore.getState().setLanguageId(79)
  return <Navigate to="/" />;
}