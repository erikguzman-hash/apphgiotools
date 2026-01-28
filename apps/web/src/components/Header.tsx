'use client';

import { useState } from 'react';
import { Button } from '@apphgio/ui';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Apphgio Tools</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Catalogo
            </a>
            <a href="/categorias" className="text-gray-600 hover:text-primary-600 transition-colors">
              Categorias
            </a>
            <a href="/soporte" className="text-gray-600 hover:text-primary-600 transition-colors">
              Soporte
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Iniciar Sesion
            </Button>
            <Button variant="primary" size="sm">
              Registrarse
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <a href="/" className="text-gray-600 hover:text-primary-600 py-2">
                Catalogo
              </a>
              <a href="/categorias" className="text-gray-600 hover:text-primary-600 py-2">
                Categorias
              </a>
              <a href="/soporte" className="text-gray-600 hover:text-primary-600 py-2">
                Soporte
              </a>
              <hr className="my-2" />
              <Button variant="ghost" size="sm" className="justify-start">
                Iniciar Sesion
              </Button>
              <Button variant="primary" size="sm">
                Registrarse
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
