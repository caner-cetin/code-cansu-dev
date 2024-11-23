import { Link } from '@tanstack/react-router'
import React from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#211e20] p-4">
      <div className="text-center space-y-8">
        <h1 className="text-[#e9efec] text-4xl sm:text-6xl lg:text-6xl font-bold tracking-wider mb-8">
          WHAT ARE YOU DOING HERE?
        </h1>
        <div className="relative w-full max-w-md mx-auto">
          <img
            src="/bumblebee.jpg"
            alt="Bumblebee stares at you"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <Link
          to='/'
          className="inline-block text-gray-400 text-xl tracking-wide hover:text-[#e9efec] transition-colors duration-200 mt-8"
          preload={false}
        >
          sorry... take me back
        </Link>
      </div>
    </div>
  )
}