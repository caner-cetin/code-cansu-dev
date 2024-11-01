import React from 'react';
import LanguageLandingPage from 'src/components/LanguageLandingPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/language/lua')({
  component: LuaRoute,
})

export default function LuaRoute () {
  return ( <LanguageLandingPage
    languageId={64}
    languageName="Lua (5.4.7)"
  /> )
    };