import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '92vh', marginTop: -78, paddingTop: 78 }}
    >
      {/* Background photo */}
      <Image
        src="/photos/IMG_3320.JPG"
        alt="FunCups — כוסות שוט בעיצוב מרשם"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Cream overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(245,240,232,0.62)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[680px] mx-auto">
        <p
          className="text-xs font-medium text-accent uppercase mb-[18px]"
          style={{ letterSpacing: '0.3em' }}
        >
          Rx #0042 · 60 ML OF TRUE FUN
        </p>

        <h1
          className="font-extrabold text-ink mb-5"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
        >
          <span className="text-accent">[</span>כותרת ראשית להחליף<span className="text-accent">]</span>
        </h1>

        <p className="text-[18px] leading-[1.7] text-stone mb-[34px] max-w-[460px] mx-auto">
          [תיאור קצר להחליף] — כוסות שוט קרמיות שנראות בדיוק כמו בקבוקי מרשם.
        </p>

        <div className="flex gap-[14px] justify-center flex-wrap">
          <Link
            href="/order"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-bold px-7 py-[13px] rounded-sm transition-colors duration-300 text-[15px] no-underline"
          >
            הזמן עכשיו
          </Link>
          <a
            href="#products"
            className="inline-block border border-ink/30 hover:border-ink text-ink font-bold px-7 py-[13px] rounded-sm transition-colors duration-300 text-[15px] no-underline"
          >
            גלה עוד
          </a>
        </div>
      </div>
    </section>
  )
}
