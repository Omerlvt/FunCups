import Link from 'next/link'

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-xs font-medium text-accent uppercase mb-4"
        style={{ letterSpacing: '0.3em' }}
      >
        בקרוב
      </p>
      <h1
        className="font-extrabold text-ink mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2 }}
      >
        דף ההזמנה בפיתוח
      </h1>
      <p className="text-stone text-sm mb-8 max-w-sm leading-relaxed">
        דף ההתאמה האישית עם תצוגת 360° יגיע בקרוב. בינתיים ניתן ליצור קשר ישירות.
      </p>
      <Link
        href="/"
        className="text-sm text-accent hover:text-accent-dark font-semibold underline underline-offset-4 transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </main>
  )
}
