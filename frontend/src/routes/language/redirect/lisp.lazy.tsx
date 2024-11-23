import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/lisp')({
  component: LispComponent,
})

function LispComponent() {
  useAppStore.getState().setLanguageId(55)
  return <Navigate to="/" />;
}