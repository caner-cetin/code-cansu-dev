import LanguageLandingPage from '@/components/LanguageLandingPage';
import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/language/lua')({
  component: LuaComponent,
})

function LuaComponent() {
  return (<LanguageLandingPage
    languageId={64}
    languageName="Lua (5.4.7)"
  />)
};