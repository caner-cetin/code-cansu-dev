import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/bash')({
  component: BashComponent,
})

function BashComponent() {
  useAppStore.getState().setLanguageId(46)
  return <Navigate to="/" />;
}