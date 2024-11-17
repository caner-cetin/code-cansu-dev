import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/clojure')({
  component: ClojureComponent,
})

function ClojureComponent() {
  useAppStore.getState().setLanguageId(86)
  return <Navigate to="/" />;
}