interface SectionHeadProps {
  eyebrow: string
  title: string
  dark?: boolean
}

export default function SectionHead({ eyebrow, title, dark }: SectionHeadProps) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-medium text-accent uppercase mb-3"
        style={{ letterSpacing: '0.3em' }}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-extrabold ${dark ? 'text-bg' : 'text-ink'}`}
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2 }}
      >
        {title}
      </h2>
    </div>
  )
}
