'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-card border-b border-border shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          EShopBD
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
            Search
          </Link>
          <Link href="/order-status" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
            Order Status
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav - Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-card border-t border-border z-40">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/search"
              className="block text-muted-foreground hover:text-foreground transition-colors hover:underline py-2"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/order-status"
              className="block text-muted-foreground hover:text-foreground transition-colors hover:underline py-2"
              onClick={() => setIsOpen(false)}
            >
              Order Status
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}