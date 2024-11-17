import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/perl')({
  component: PerlComponent,
})

function PerlComponent() {
  useAppStore.getState().setLanguageId(85)
  return <Navigate to="/" />;
}