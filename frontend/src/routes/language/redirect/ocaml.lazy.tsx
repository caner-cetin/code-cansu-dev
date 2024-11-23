import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/ocaml')({
  component: OCamlComponent,
})

function OCamlComponent() {
  useAppStore.getState().setLanguageId(65)
  return <Navigate to="/" />;
}