'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHead from '@/components/SectionHead'
import OrderForm from '@/components/order/OrderForm'

const CupViewer = dynamic(() => import('@/components/order/CupViewer'), { ssr: false })

export default function OrderPage() {
  const [name, setName] = useState('')
  const [warning, setWarning] = useState('')
  const [sku, setSku] = useState<'single' | 'full'>('single')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-[72px]">
        <div className="max-w-[980px] mx-auto px-6 py-12">
          <SectionHead eyebrow="ההזמנה שלך" title="התאם אישית את הכוס" />

          <div className="mt-10 flex flex-col md:flex-row gap-10 items-start">
            {/* 3D viewer — sticky on desktop */}
            <div className="w-full md:w-[55%] md:sticky md:top-[88px]">
              <CupViewer
                name={name}
                warning={warning}
                className="w-full aspect-square rounded-xl overflow-hidden shadow-lg"
              />
            </div>

            {/* Customization form */}
            <div className="w-full md:w-[45%]">
              <OrderForm
                name={name}
                warning={warning}
                sku={sku}
                onNameChange={setName}
                onWarningChange={setWarning}
                onSkuChange={setSku}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
