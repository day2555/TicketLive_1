"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="rounded-lg bg-primary/20 p-2 transition-colors group-hover:bg-primary/30">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10Z" />
              <path d="M13 4L13 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
            </svg>
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

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-zinc-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                      <p className="text-sm text-white font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </Link>

                      <Link
                        href="/mis-pedidos"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mis Pedidos
                      </Link>

                      <Link
                        href="/favoritos"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Favoritos
                      </Link>

                      <div className="border-t border-white/10 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Usuario NO autenticado - Mostrar botones de login/registro
              <>
                <Link href="/login">
                  <button className="text-white hover:text-primary transition-colors font-medium">
                    Iniciar sesión
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-purple-500/30">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}