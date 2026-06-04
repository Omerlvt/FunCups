'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#products', label: 'המוצרים' },
  { href: '#concept',  label: 'הרעיון' },
  { href: '#gallery',  label: 'גלריה' },
  { href: '#orders',   label: 'הזמנות אמיתיות' },
  { href: '#faq',      label: 'שאלות' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg shadow-nav' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1120px] mx-auto px-7 py-[18px] flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="text-[22px] font-extrabold tracking-[-0.02em] text-ink no-underline">
          FunCups<sup className="text-[11px]">™</sup>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-[30px] text-sm font-medium list-none m-0 p-0">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-stone hover:text-ink transition-colors duration-300 no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/order"
          className="hidden md:inline-block bg-accent hover:bg-accent-dark text-white text-sm font-bold px-[22px] py-[10px] rounded-sm transition-colors duration-300 no-underline"
        >
          הזמן עכשיו
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1.5 bg-transparent border-0 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="תפריט"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-0.5 bg-ink transition-all duration-200"
              style={{
                transform:
                  open && i === 0 ? 'translateY(7px) rotate(45deg)' :
                  open && i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-bg border-t border-black/5 px-7 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-ink no-underline"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="bg-accent text-white text-sm font-bold px-[22px] py-[10px] rounded-sm text-center mt-1 no-underline"
          >
            הזמן עכשיו
          </Link>
        </div>
      )}
    </header>
  )
}
