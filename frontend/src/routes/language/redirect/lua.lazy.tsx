import React from 'react'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'

export const Route = createLazyFileRoute('/language/redirect/lua')({
  component: LuaComponent,
})

function LuaComponent() {
  useAppStore.getState().setLanguageId(64)
  return <Navigate to="/" />;
}