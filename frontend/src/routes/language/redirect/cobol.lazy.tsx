import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/cobol')({
  component: COBOLComponent,
})

function COBOLComponent() {
  useAppStore.getState().setLanguageId(77)
  return <Navigate to="/" />;
}