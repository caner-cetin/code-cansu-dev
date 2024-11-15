import type { Metadata } from 'next'
import { RootLayout } from './root'
import './globals.css'

export const metadata: Metadata = {
  title: "Caner's Wonderland",
  description: 'im naked',
}
export default function RootLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // this is beyond stupid
    // for declaring metadata, page has to be a server side component, you cannot declare a component as client side and then export a component there
    // so ihave
    // -
    // --> layout.tsx [you are here]
    // --> root.tsx
    // --> page.tsx
    //
    // where page is the index page '/' client side component, i cannot export metadata there.
    // root is the root layout component, contains stateful tanstack query declaration, i cannot export metadata there.
    // so we have a layout file thats sole purpose is to export metadata, thats why this function is named RootLayoutShell
    // actual root is the root layout component, modify it if you want to do something globally
    <RootLayout>{children}</RootLayout>
  )
}
