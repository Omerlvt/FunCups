'use client'

import Image from 'next/image'
import { useState } from 'react'
import SectionHead from '@/components/SectionHead'

const PHOTOS = [
  'IMG_3313.JPG', 'IMG_3314.JPG', 'IMG_3315.JPG', 'IMG_3317.JPG',
  'IMG_3319.JPG', 'IMG_3321.JPG', 'IMG_3325.JPG', 'IMG_3328.JPG',
]

function GalleryTile({ photo }: { photo: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
    >
      <Image
        src={`/photos/${photo}`}
        alt="FunCups"
        fill
        className="object-cover transition-transform duration-500"
        style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    </div>
  )
}

export default function PhotoGallery() {
  return (
    <section id="gallery" className="py-24 px-6 bg-bg2">
      <div className="max-w-[1120px] mx-auto">
        <SectionHead eyebrow="גלריה" title="מבט מקרוב" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
          {PHOTOS.map((p) => (
            <GalleryTile key={p} photo={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
