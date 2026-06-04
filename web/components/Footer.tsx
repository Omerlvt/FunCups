import Link from 'next/link'

export default function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '972500000000'
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent('שלום, יש לי שאלה על FunCups')}`

  return (
    <footer className="bg-ink text-bg py-[52px] px-6">
      <div className="max-w-[980px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
        <Link
          href="/"
          className="text-[22px] font-extrabold tracking-[-0.02em] text-bg no-underline"
        >
          FunCups<sup className="text-[11px]">™</sup>
        </Link>

        <div className="flex gap-8 text-sm">
          <FooterLink href="/order">הזמן עכשיו</FooterLink>
          <FooterLink href={waLink} external>WhatsApp</FooterLink>
          <FooterLink href="#">Instagram</FooterLink>
        </div>

        <p className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>
          © {new Date().getFullYear()} FunCups™. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className = "no-underline transition-colors duration-300 hover:text-bg"
  const style = { color: 'rgba(245,240,232,0.6)' }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  )
}
