import SectionHead from '@/components/SectionHead'

const LABELS = [
  'ריטה לין.svg',
  'Juan Moore.svg',
  'Phil Mccup.svg',
  'מור פיום.svg',
  'Jen Antonic.svg',
  'Kenya Pourit.svg',
  'ציפי רילקס.svg',
  'Roman Coke.svg',
]

export default function RealOrdersMarquee() {
  const doubled = [...LABELS, ...LABELS]

  return (
    <section id="orders" className="py-24 bg-bg overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-6 mb-12">
        <SectionHead eyebrow="הזמנות אמיתיות" title="כבר הזמינו" />
      </div>

      {/* dir="ltr" so translateX(-50%) scrolls left-to-right correctly */}
      <div className="fc-marquee-wrap relative" dir="ltr">
        <div className="fc-fade fc-fade-l" />
        <div className="fc-fade fc-fade-r" />
        <div className="fc-marquee-track">
          {doubled.map((label, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-md overflow-hidden"
              style={{ width: 400, height: 174, margin: '0 12px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/labels/${encodeURIComponent(label)}`}
                alt={label.replace('.svg', '')}
                width={400}
                height={174}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
