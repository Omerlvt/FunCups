'use client'

import { useState } from 'react'
import SectionHead from '@/components/SectionHead'

const FAQS = [
  { q: 'מה החומר של הכוסות?', a: 'הכוסות עשויות מקרמיקה פרמיום עמידה. המשטח מבריק וקל לניקוי, והגרפיקה צרובה בכבשן ועמידה למים.' },
  { q: 'מה הנפח של כל כוס?', a: 'כל כוס מכילה 60 מ"ל — שוט כפול תקני. לא יותר ולא פחות ממה שצריך.' },
  { q: 'אפשר להזמין עם שם מותאם אישית?', a: 'כן! ניתן לבחור שם מותאם אישית לתווית "המטופל" בדף ההזמנה.' },
  { q: 'מה ההבדל בין מנה בודדת למרשם המלא?', a: 'מנה בודדת — כוס אחת. המרשם המלא — ארבע כוסות עם תוויות שונות, בתוך אריזת מתנה.' },
  { q: 'האם זה מתאים למתנה?', a: 'זו אחת המתנות הכי מקוריות שתמצאו. "המרשם המלא" מגיע באריזה מיוחדת — מושלם לימי הולדת, מסיבות רווקות וכל אירוע.' },
  { q: 'כמה זמן לוקח משלוח?', a: 'לאחר אישור ההזמנה — 5–7 ימי עסקים. ניצור קשר בוואטסאפ לאחר הגשת ההזמנה.' },
]

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 bg-transparent border-0 cursor-pointer text-right"
      >
        <span className="text-base font-bold text-ink leading-relaxed">{q}</span>
        <span
          className="flex-shrink-0 text-accent text-[22px] leading-none transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && (
        <p className="text-sm leading-[1.8] text-stone pb-[22px] max-w-[540px]">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 bg-bg2">
      <div className="max-w-[640px] mx-auto">
        <SectionHead eyebrow="שאלות נפוצות" title="יש שאלות?" />
        <div className="mt-12">
          {FAQS.map((f, i) => (
            <FAQItem key={i} {...f} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
