# FunCups Order Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/order` page with a live 360° 3D cup preview, label customization (name + warning), SKU picker, and a WhatsApp order CTA.

**Architecture:** State (`name`, `warning`, `sku`) lives in `page.tsx` and flows to two siblings: `CupViewer` (R3F canvas that paints the customized label onto the GLB as a canvas texture) and `OrderForm` (inputs + SKU toggle + WhatsApp button). `LabelCanvas.ts` is a pure drawing utility with no React or Three.js dependencies.

**Tech Stack:** Next.js 14 App Router, `@react-three/fiber`, `@react-three/drei`, `three`, Tailwind CSS v4, TypeScript.

---

## Files

| File | Action | Responsibility |
| --- | --- | --- |
| `web/components/order/LabelCanvas.ts` | Create | Pure fn: draws full Rx label onto an offscreen canvas |
| `web/components/order/CupViewer.tsx` | Create | R3F Canvas: loads GLB, applies canvas texture, orbit controls, loading skeleton |
| `web/components/order/OrderForm.tsx` | Create | Name/warning inputs, SKU picker, WhatsApp CTA button |
| `web/app/order/page.tsx` | Replace | State management + two-column layout wiring both components |

---

## Task 1: Install Three.js dependencies

**Files:**
- Modify: `web/package.json` (via npm install)

- [ ] **Step 1: Install packages**

```bash
cd web
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

- [ ] **Step 2: Verify install succeeded**

```bash
cd web && npm ls three @react-three/fiber @react-three/drei
```

Expected: all three packages listed with version numbers, no peer dependency errors.

- [ ] **Step 3: Commit**

```bash
cd web && git add package.json package-lock.json
git commit -m "chore: add three.js and react-three-fiber deps"
```

---

## Task 2: Create LabelCanvas utility

**Files:**
- Create: `web/components/order/LabelCanvas.ts`

Pure function — no React, no Three.js. Takes a canvas element + field values, draws the full Rx label.

- [ ] **Step 1: Create the file**

Create `web/components/order/LabelCanvas.ts`:

```ts
export interface LabelFields {
  name: string
  warning: string
}

export function drawLabel(canvas: HTMLCanvasElement, fields: LabelFields): void {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  // Header bar (Walmart dark blue)
  ctx.fillStyle = '#003087'
  ctx.fillRect(0, 0, w, h * 0.13)

  // Header left: "Walmart ✳ Pharmacy"
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${Math.round(h * 0.07)}px "Courier New", monospace`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Walmart ✳ Pharmacy', w * 0.03, h * 0.065)

  // Header right: pharmacy number
  ctx.font = `${Math.round(h * 0.04)}px "Courier New", monospace`
  ctx.textAlign = 'right'
  ctx.fillText('1234 PHARM', w * 0.97, h * 0.065)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // RX number
  ctx.fillStyle = '#1A1A1A'
  ctx.font = `${Math.round(h * 0.05)}px "Courier New", monospace`
  ctx.fillText('1234567', w * 0.03, h * 0.24)

  // Patient name — large bold
  ctx.font = `bold ${Math.round(h * 0.11)}px "Courier New", monospace`
  ctx.fillStyle = '#1A1A1A'
  ctx.fillText(clipText(ctx, fields.name || 'Your Name', w * 0.94), w * 0.03, h * 0.38)

  // Address line
  ctx.font = `${Math.round(h * 0.042)}px "Courier New", monospace`
  ctx.fillStyle = '#555555'
  ctx.fillText('42069 FAKE STREET CITY', w * 0.03, h * 0.46)

  // Warning box — yellow background
  const warnY = h * 0.50
  const warnH = h * 0.20
  ctx.fillStyle = '#F4E84B'
  ctx.fillRect(w * 0.02, warnY, w * 0.96, warnH)

  ctx.fillStyle = '#1A1A1A'
  ctx.font = `bold ${Math.round(h * 0.044)}px "Courier New", monospace`
  wrapText(
    ctx,
    'Warning: ' + (fields.warning || ''),
    w * 0.04,
    warnY + h * 0.065,
    w * 0.92,
    h * 0.058,
    2
  )

  // Static bottom lines
  ctx.fillStyle = '#1A1A1A'
  ctx.font = `${Math.round(h * 0.038)}px "Courier New", monospace`
  const baseY = h * 0.745
  const lineH = h * 0.058
  ctx.fillText('60 ML Of True FUN', w * 0.03, baseY)
  ctx.fillText('QTY Infinite, Discard After...', w * 0.03, baseY + lineH)
  ctx.fillText('DOCTOR: LIFE', w * 0.03, baseY + lineH * 2)
  ctx.fillText('MAY REFILL WHEN EVER THE FEELS HIT', w * 0.03, baseY + lineH * 3)
}

function clipText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let clipped = text
  while (ctx.measureText(clipped + '…').width > maxWidth && clipped.length > 0) {
    clipped = clipped.slice(0, -1)
  }
  return clipped + '…'
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): void {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  let drawn = 0

  for (const word of words) {
    if (drawn >= maxLines) break
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      drawn++
      if (drawn >= maxLines) break
      line = word
      currentY += lineHeight
    } else {
      line = test
    }
  }
  if (line && drawn < maxLines) {
    ctx.fillText(clipText(ctx, line, maxWidth), x, currentY)
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: exits with code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add web/components/order/LabelCanvas.ts
git commit -m "feat: add LabelCanvas utility for Rx label drawing"
```

---

## Task 3: Create CupViewer component

**Files:**
- Create: `web/components/order/CupViewer.tsx`

`'use client'` component. Renders an R3F `<Canvas>` with the GLB model, orbit controls, and a live canvas texture applied to the label mesh.

- [ ] **Step 1: Create the file**

Create `web/components/order/CupViewer.tsx`:

```tsx
'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { drawLabel, type LabelFields } from './LabelCanvas'

interface CupViewerProps extends LabelFields {
  className?: string
}

export default function CupViewer({ name, warning, className }: CupViewerProps) {
  return (
    <div className={className} style={{ background: '#F5F0E8' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} />
        <Suspense fallback={<CupSkeleton />}>
          <CupScene name={name} warning={warning} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  )
}

function CupScene({ name, warning }: LabelFields) {
  const { scene } = useGLTF('/ceramic fun cup keyshot.glb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const labelMatRef = useRef<THREE.MeshStandardMaterial | null>(null)

  // On mount: find the label mesh, create the canvas texture, wire it up
  useEffect(() => {
    if (!canvasRef.current) {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 512
      canvasRef.current = c
    }
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvasRef.current)
      textureRef.current.flipY = false
    }

    if (!labelMatRef.current) {
      // Log all meshes so developer can identify label mesh name if heuristic misses
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial
          console.log('[CupViewer] mesh:', child.name, '| material:', mat?.name)
        }
      })

      // Primary: find by name containing "label" or "sticker"
      scene.traverse((child) => {
        if (labelMatRef.current) return
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial
          const n = child.name.toLowerCase()
          const m = (mat?.name ?? '').toLowerCase()
          if (n.includes('label') || n.includes('sticker') || m.includes('label') || m.includes('sticker')) {
            labelMatRef.current = mat
          }
        }
      })

      // Fallback: first mesh with a texture map
      if (!labelMatRef.current) {
        scene.traverse((child) => {
          if (labelMatRef.current) return
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshStandardMaterial
            if (mat?.map) labelMatRef.current = mat
          }
        })
      }

      if (labelMatRef.current) {
        labelMatRef.current.map = textureRef.current
        labelMatRef.current.needsUpdate = true
      }
    }
  }, [scene])

  // Redraw label on every name/warning change
  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return
    drawLabel(canvasRef.current, { name, warning })
    textureRef.current.needsUpdate = true
  }, [name, warning])

  return <primitive object={scene} scale={1.8} position={[0, -0.4, 0]} />
}

// R3F mesh shown while GLB is loading
function CupSkeleton() {
  return (
    <mesh>
      <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
      <meshStandardMaterial color="#C4724A" opacity={0.3} transparent />
    </mesh>
  )
}

useGLTF.preload('/ceramic fun cup keyshot.glb')
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: exits with code 0.

- [ ] **Step 3: Commit**

```bash
git add web/components/order/CupViewer.tsx
git commit -m "feat: add CupViewer 3D component with live canvas texture"
```

---

## Task 4: Create OrderForm component

**Files:**
- Create: `web/components/order/OrderForm.tsx`

- [ ] **Step 1: Create the file**

Create `web/components/order/OrderForm.tsx`:

```tsx
const SKU_OPTIONS = [
  { value: 'single' as const, label: 'Single Dose', hebrew: 'כוס אחת' },
  { value: 'full' as const, label: 'Full Prescription', hebrew: '4 כוסות' },
]

interface OrderFormProps {
  name: string
  warning: string
  sku: 'single' | 'full'
  onNameChange: (v: string) => void
  onWarningChange: (v: string) => void
  onSkuChange: (v: 'single' | 'full') => void
}

export default function OrderForm({
  name,
  warning,
  sku,
  onNameChange,
  onWarningChange,
  onSkuChange,
}: OrderFormProps) {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '972500000000'
  const skuLabel = sku === 'single' ? 'Single Dose (כוס אחת)' : 'Full Prescription (4 כוסות)'

  const waText = [
    'שלום! רוצה להזמין FunCups 🎉',
    `📦 מוצר: ${skuLabel}`,
    `👤 שם: ${name}`,
    warning ? `⚠️ אזהרה: ${warning}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
  const canOrder = name.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* SKU picker */}
      <div>
        <p
          className="text-xs font-semibold text-stone uppercase mb-3"
          style={{ letterSpacing: '0.15em' }}
        >
          בחר מוצר
        </p>
        <div className="flex gap-3">
          {SKU_OPTIONS.map((opt) => {
            const selected = sku === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSkuChange(opt.value)}
                className={[
                  'flex-1 rounded-lg border-2 py-3 px-4 text-right transition-all duration-200',
                  selected
                    ? 'border-accent bg-accent/10 text-ink'
                    : 'border-ink/10 bg-bg2 text-ink hover:border-ink/30',
                ].join(' ')}
              >
                <span className="block text-sm font-bold">{opt.label}</span>
                <span className="block text-xs text-stone mt-0.5">{opt.hebrew}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name field */}
      <div>
        <label
          className="block text-xs font-semibold text-stone uppercase mb-2"
          style={{ letterSpacing: '0.15em' }}
        >
          שם המטופל
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Jen, Antonic"
          dir="ltr"
          className="w-full rounded-md border border-ink/10 bg-bg2 px-4 py-3 font-mono text-sm text-ink placeholder:text-stone/60 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Warning field */}
      <div>
        <label
          className="block text-xs font-semibold text-stone uppercase mb-2"
          style={{ letterSpacing: '0.15em' }}
        >
          אזהרה
        </label>
        <textarea
          rows={2}
          value={warning}
          onChange={(e) => onWarningChange(e.target.value)}
          placeholder="Sobriety is a myth caused by dangerously low alcohol levels."
          dir="ltr"
          className="w-full resize-none rounded-md border border-ink/10 bg-bg2 px-4 py-3 font-mono text-sm text-ink placeholder:text-stone/60 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* WhatsApp CTA */}
      <a
        href={canOrder ? waHref : undefined}
        target={canOrder ? '_blank' : undefined}
        rel="noopener noreferrer"
        aria-disabled={!canOrder}
        className={[
          'flex items-center justify-center gap-3 w-full rounded-full py-4 px-6 text-sm font-bold transition-all duration-200',
          canOrder
            ? 'bg-accent text-bg hover:bg-accent-dark cursor-pointer'
            : 'bg-ink/10 text-stone cursor-not-allowed pointer-events-none',
        ].join(' ')}
      >
        <WhatsAppIcon />
        שלח הזמנה ב-WhatsApp
      </a>

      {!canOrder && (
        <p className="text-center text-xs text-stone -mt-3">
          הכנס שם כדי להמשיך
        </p>
      )}
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: exits with code 0.

- [ ] **Step 3: Commit**

```bash
git add web/components/order/OrderForm.tsx
git commit -m "feat: add OrderForm with SKU picker and WhatsApp CTA"
```

---

## Task 5: Wire the order page

**Files:**
- Replace: `web/app/order/page.tsx`

- [ ] **Step 1: Replace the file entirely**

Replace `web/app/order/page.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: exits with code 0.

- [ ] **Step 3: Commit**

```bash
git add web/app/order/page.tsx
git commit -m "feat: wire order page with 3D viewer, form, and state"
```

---

## Task 6: Identify label mesh and verify live preview

This task confirms the canvas texture lands on the correct mesh in the actual GLB.

- [ ] **Step 1: Start the dev server**

```bash
cd web && npm run dev
```

Open `http://localhost:3000/order`.

- [ ] **Step 2: Read console output to find the label mesh**

Open DevTools → Console. Look for lines starting with `[CupViewer] mesh:`. They will list every mesh name and material name in the GLB, for example:

```
[CupViewer] mesh: Cup_Body | material: Ceramic_mat
[CupViewer] mesh: Label_Mesh | material: Label_material
[CupViewer] mesh: Cap_Mesh | material: Cap_mat
```

Identify which mesh name corresponds to the white label rectangle. Typically it will contain "label", "sticker", or similar.

- [ ] **Step 3: Update CupViewer targeting if the heuristic missed**

If the label mesh name does NOT contain "label" or "sticker", open `web/components/order/CupViewer.tsx` and replace the name-check block (the one with `.includes('label') || .includes('sticker')`) with a direct name match:

```tsx
// Replace the primary traverse block with:
scene.traverse((child) => {
  if (labelMatRef.current) return
  if (child instanceof THREE.Mesh && child.name === 'EXACT_MESH_NAME_FROM_CONSOLE') {
    labelMatRef.current = child.material as THREE.MeshStandardMaterial
  }
})
```

Substitute `EXACT_MESH_NAME_FROM_CONSOLE` with the actual name you read in Step 2.

- [ ] **Step 4: Verify live label update**

In the browser, type into the Name field. The patient name on the cup label should update in real time. Type into the Warning field — the yellow warning box text should update.

- [ ] **Step 5: Verify WhatsApp message**

Fill in a name (e.g. `Cohen, David`) and a warning (e.g. `Side effects include uncontrollable fun`). Click the WhatsApp button. Confirm the opened chat pre-fills:

```
שלום! רוצה להזמין FunCups 🎉
📦 מוצר: Single Dose (כוס אחת)
👤 שם: Cohen, David
⚠️ אזהרה: Side effects include uncontrollable fun
```

- [ ] **Step 6: Commit mesh name fix (only if Step 3 applied)**

```bash
git add web/components/order/CupViewer.tsx
git commit -m "fix: target label mesh by exact name in CupViewer"
```

---

## Task 7: Mobile verification and final commit

- [ ] **Step 1: Open on mobile viewport**

In DevTools, switch to mobile simulation (375px wide). Verify:
- 3D viewer appears on top, full width
- Form is stacked below the viewer
- WhatsApp button is full width and easy to tap

- [ ] **Step 2: Verify auto-rotate behavior**

On mobile viewport (touch simulation), drag the cup — it should rotate freely and auto-rotate should pause while dragging.

- [ ] **Step 3: Verify disabled button state**

Clear the Name field completely. Confirm the WhatsApp button is grayed out and unclickable. Enter a name — button becomes active.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete FunCups order page with 3D cup customizer"
```
