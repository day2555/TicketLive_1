"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // 🪝 Usamos el estado real de autenticación

  return (
    <nav className="bg-zinc-900 bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-500 border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              {/* Icono del ticket SVG */}
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10Z"
                  fill="url(#gradient)"
                  stroke="url(#gradient)"
                  strokeWidth="1.5"
                />
                <path d="M13 4L13 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A855F7" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Texto del logo */}
              <span className="text-white text-xl font-bold tracking-wide">TicketLive</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/events"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Eventos
            </Link>
            <Link
              href="/promociones"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Promociones
            </Link>
            <Link
              href="/como-funciona"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Cómo funciona
            </Link>
            <Link
              href="/testimonios"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Testimonios
            </Link>
            {/* Carrito de compras (Se puede modificar después el icono jeje) */}
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              🛒 
            </Link>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            TicketLive
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="/eventos" className="hover:text-white transition-colors">
            Eventos
          </Link>
          <Link href="/promociones" className="hover:text-white transition-colors">
            Promociones
          </Link>
          <Link href="/como-funciona" className="hover:text-white transition-colors">
            Cómo funciona
          </Link>
          <Link href="/testimonios" className="hover:text-white transition-colors">
            Testimonios
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button className="text-muted-foreground hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Auth Section */}
          <div className="hidden sm:flex gap-3 items-center">
            {isAuthenticated && user ? (
              // Usuario autenticado - Mostrar menú de usuario
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/50"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="form-button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              // Usuario NO autenticado - Mostrar botones de login/registro
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-purple-400 font-medium transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-500/50"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 bg-opacity-95 border-t border-purple-500 border-opacity-20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/eventos"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              href="/promociones"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Promociones
            </Link>
            <Link
              href="/como-funciona"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="/testimonios"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonios
            </Link>
            {/* Carrito de compras (Se puede modificar después el icono jeje) */}
            <Link
              href="/cart"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🛒
            </Link>

            {/* Auth Section Mobile */}
            <div className="pt-4 space-y-2 border-t border-purple-500 border-opacity-20">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/favoritos"
                    className="block text-center text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ❤️ Mis Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center text-white hover:text-purple-400 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-3 rounded-lg font-medium transition-colors shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}