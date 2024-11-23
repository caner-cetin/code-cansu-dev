import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/php')({
  component: PHPComponent,
})

function PHPComponent() {
  useAppStore.getState().setLanguageId(68)
  return <Navigate to="/" />;
}