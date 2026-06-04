import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductShowcase from '@/components/ProductShowcase'
import Concept from '@/components/Concept'
import PhotoGallery from '@/components/PhotoGallery'
import RealOrdersMarquee from '@/components/RealOrdersMarquee'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductShowcase />
        <Concept />
        <PhotoGallery />
        <RealOrdersMarquee />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
