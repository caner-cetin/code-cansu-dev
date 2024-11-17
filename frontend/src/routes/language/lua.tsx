import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/language/lua')({
  component: LuaComponent,
})

function LuaComponent() {
  return (<LanguageLandingPage
    languageId={64}
    languageName="Lua (5.4.7)"
  />)
};