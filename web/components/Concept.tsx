import Image from 'next/image'

export default function Concept() {
  return (
    <section id="concept" className="py-24 px-6 bg-bg">
      <div className="max-w-[980px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p
            className="text-xs font-medium text-accent uppercase mb-3"
            style={{ letterSpacing: '0.3em' }}
          >
            הרעיון
          </p>
          <h2
            className="font-extrabold text-ink mb-[22px]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2 }}
          >
            אותה תנועה בדיוק. שוט, או כדור?
          </h2>
          <p className="text-[15px] leading-[1.8] text-stone mb-4">
            הקולקציה חוקרת את המפגש בין שתייה חברתית לבין צריכת תרופות מודרנית — אותה תנועה פיזית בדיוק
            של הרמת שוט ובליעת כדור. [פסקה להחליף]
          </p>
          <p className="text-[15px] leading-[1.8] text-stone">
            דרך הומור שחור ומיתוג נועז, המוצר פותח שיחה על הרגלים מודרניים — ובו-זמנית הוא פריט באר
            בלתי-נשכח. [פסקה להחליף]
          </p>
          {/* Rx pull-quote — note: border-inline-start is RTL-aware (puts border on right side) */}
          <div
            className="mt-[30px] ps-4"
            style={{ borderInlineStart: '2px solid #C4724A' }}
          >
            <p className="font-mono text-xs leading-[1.7] text-ink" style={{ letterSpacing: '0.04em' }}>
              60 ML OF True FUN · QTY Infinite,<br />Discard After Hospital · DOCTOR, LIFE
            </p>
          </div>
        </div>

        {/* Photo */}
        <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src="/photos/IMG_3318.JPG"
            alt="עיצוב המרשם"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
