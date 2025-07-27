"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Season Predictions", href: "/season_predictions" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🏈</span>
            <h1 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
              BallPredict
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {children}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-transform duration-300 ${
                  isMenuOpen ? "rotate-45 top-3" : "top-1"
                }`}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100 top-3"
                }`}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-transform duration-300 ${
                  isMenuOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">{children}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
