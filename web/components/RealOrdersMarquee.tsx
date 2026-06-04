import Image from 'next/image'
import SectionHead from '@/components/SectionHead'

const ORDER_PHOTOS = [
  'IMG_3322.JPG', 'IMG_3324.JPG', 'IMG_3326.JPG', 'IMG_3327.JPG',
  'IMG_3329.JPG', 'IMG_3330.JPG', 'IMG_3331.JPG', 'IMG_3333.JPG',
]

export default function RealOrdersMarquee() {
  const doubled = [...ORDER_PHOTOS, ...ORDER_PHOTOS]

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
          {doubled.map((photo, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-md overflow-hidden border border-black/[0.08]"
              style={{ width: 208, height: 208, margin: '0 12px' }}
            >
              <Image
                src={`/photos/${photo}`}
                alt="הזמנה של לקוח"
                width={208}
                height={208}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
