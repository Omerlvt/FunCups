import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FunCups™',
  description: 'כוסות שוט קרמיות בעיצוב בקבוקי תרופות — מתנה ייחודית לכל אירוע',
  openGraph: {
    title: 'FunCups™',
    description: 'כוסות שוט קרמיות בעיצוב בקבוקי תרופות',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  )
}
