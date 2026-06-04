'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import SectionHead from '@/components/SectionHead'

const PRODUCTS = [
  {
    id: 'single',
    name: 'מנה בודדת',
    sub: 'Single Dose',
    photo: '/photos/IMG_3316.JPG',
    desc: 'כוס שוט קרמית אחת, 60 מ"ל. לכל מי שמבין שדי במנה אחת.',
    href: '/order?product=single',
  },
  {
    id: 'pack',
    name: 'המרשם המלא',
    sub: 'Full Prescription · 4-pack',
    photo: '/photos/IMG_3312.JPG',
    desc: 'ארבע כוסות עם תוויות "מטופלים" שונות, באריזת מתנה. לאירוח ולמתנה.',
    href: '/order?product=pack',
  },
]

function ProductCard({ name, sub, desc, photo, href }: typeof PRODUCTS[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-surface border border-black/[0.08] rounded-xl overflow-hidden flex flex-col transition-shadow duration-300"
      style={{ boxShadow: hovered ? '0 12px 40px rgba(26,26,26,0.10)' : '0 4px 16px rgba(26,26,26,0.06)' }}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-7 flex flex-col flex-1">
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-stone mb-1.5">{sub}</p>
        <h3 className="text-2xl font-extrabold text-ink mb-2.5">{name}</h3>
        <p className="text-sm leading-[1.7] text-stone flex-1 mb-[22px]">{desc}</p>
        <Link
          href={href}
          className="self-start inline-block bg-accent hover:bg-accent-dark text-white font-bold px-7 py-[13px] rounded-sm transition-colors duration-300 text-[15px] no-underline"
        >
          הזמן
        </Link>
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  return (
    <section id="products" className="py-24 px-6 bg-bg2">
      <div className="max-w-[980px] mx-auto">
        <SectionHead eyebrow="המוצרים" title="בחר את המינון שלך" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-14">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
