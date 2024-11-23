import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/python')({
  component: PythonComponent,
})

function PythonComponent() {
  useAppStore.getState().setLanguageId(70)
  return <Navigate to="/" />;
}