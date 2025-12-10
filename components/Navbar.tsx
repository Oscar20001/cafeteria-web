'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Coffee } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down and past 100px
          setIsVisible(false);
        } else { // if scroll up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed w-full z-50 bg-black/80 backdrop-blur-sm text-white transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-amber-500" />
              <span className="font-bold text-xl tracking-wider">CAFÉ ALEJANDRÍA</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#menu" className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menú</Link>
              <Link href="/reservas" className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Reservas</Link>
              <Link href="/order" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-lg hover:shadow-amber-500/20">Ordenar</Link>
              <Link href="/lealtad" className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Lealtad</Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#menu" className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium">Menú</Link>
            <Link href="/reservas" className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium">Reservas</Link>
            <Link href="/lealtad" className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium">Lealtad</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
