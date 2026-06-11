# Order Page Design — FunCups `/order`

**Date:** 2026-06-11  
**Status:** Approved

---

## Overview

Replace the current "coming soon" placeholder at `/order` with a fully interactive order page. The customer configures their personalized Rx label, previews it live on a 360° 3D model of the cup, picks a SKU, and sends their order via WhatsApp.

---

## Architecture

### New dependencies
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — helpers (OrbitControls, useGLTF, etc.)
- `three` + `@types/three`

### File structure
```
web/
  app/
    order/
      page.tsx              — page shell (Navbar + OrderPage + Footer)
  components/
    order/
      CupViewer.tsx         — R3F Canvas, loads GLB, applies canvas texture
      LabelCanvas.ts        — pure utility: draws Rx label onto an offscreen canvas
      OrderForm.tsx         — name + warning inputs, SKU picker, WhatsApp CTA
```

The GLB asset is already in `web/public/ceramic fun cup keyshot.glb`.

---

## Section 1: Page Layout

Reuses existing `Navbar` and `Footer` components unchanged.

**Mobile:** Stacked — 3D viewer on top (~60vw tall square canvas), form below.  
**Desktop:** Two-column — viewer takes left ~55%, form panel right ~45%, form sticky so viewer stays visible while scrolling.

A small `SectionHead` label above reads `"ההזמנה שלך"` using the existing `SectionHead` component pattern.

---

## Section 2: 3D Viewer (`CupViewer.tsx`)

- Loads `ceramic fun cup keyshot.glb` via `useGLTF`
- `OrbitControls`: free drag rotation, slow auto-rotate on load, stops on user touch
- Lighting: ambient light + two directional lights replicating the clean white-studio look from product photos
- On mount: traverse `scene` to find the label mesh (identified by its white rectangle texture map), replace its material's `map` with a live `CanvasTexture`
- Loading state: pulsing skeleton in `#C4724A` amber while GLB downloads
- The viewer is a `'use client'` component (Three.js requires browser APIs)

---

## Section 3: Label Canvas (`LabelCanvas.ts`)

Pure function signature:
```ts
drawLabel(canvas: HTMLCanvasElement, fields: { name: string; warning: string }): void
```

Draws the full Rx label onto an off-screen canvas (not in the DOM). Layout matches the real product exactly:

```
┌─────────────────────────────────────────┐
│  Walmart ✳ Pharmacy          1234 PHARM │  static
│─────────────────────────────────────────│
│  1234567                                │  static RX number
│  [NAME, Customer]                       │  LARGE BOLD — editable field
│  42069 FAKE STREET CITY                 │  static
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Warning: [warning text]             │ │  yellow bg box — editable field
│ └─────────────────────────────────────┘ │
│                                         │
│  60 ML Of True FUN                      │  static
│  QTY Infinite, Discard After...         │  static
│  DOCTOR: LIFE                           │  static
│  MAY REFILL WHEN EVER THE FEELS HIT     │  static
└─────────────────────────────────────────┘
```

Font: Courier New (`--font-mono`). White background, dark ink text, yellow (`#F4E84B`) highlight behind warning text.

`CupViewer` calls `drawLabel` on every field change and sets `texture.needsUpdate = true` — the cup updates instantly.

---

## Section 4: Customization Form (`OrderForm.tsx`)

### Inputs (Hebrew RTL labels)

| Label | Type | Placeholder |
|---|---|---|
| שם המטופל | `<input type="text">` | `Jen, Antonic` |
| אזהרה | `<textarea rows={2}>` | `Warning: Sobriety is a myth caused by dangerously low alcohol levels.` |

Styling: `bg-bg2`, `border border-ink/10`, `rounded-md`, `font-mono` — label aesthetic matches the cup.

Both fields are controlled state lifted to the parent `page.tsx` and passed as props to both `OrderForm` and `CupViewer`.

### SKU Picker

Two toggle cards side by side:

| Option | Hebrew | Value |
| --- | --- | --- |
| Single Dose | כוס אחת | `single` |
| Full Prescription | 4 כוסות | `full` |

Selected card: `border-accent` + `bg-accent/5`. Unselected: subtle `border-ink/10`.

### WhatsApp CTA

Full-width button, `bg-accent text-bg`, WhatsApp icon (SVG), label: `"שלח הזמנה ב-WhatsApp"`.

**Disabled** (grayed) until `name.trim().length > 0`.

**WhatsApp URL pattern:**
```
https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=
שלום! רוצה להזמין FunCups 🎉
📦 מוצר: {SKU label}
👤 שם: {name}
⚠️ אזהרה: {warning}
```

WhatsApp number read from `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` (already set up in the project).

---

## Data Flow

```
page.tsx
  state: { name, warning, sku }
  │
  ├── CupViewer  ← receives { name, warning }
  │     └── LabelCanvas.drawLabel() called on every change
  │           └── texture.needsUpdate = true → Three.js re-renders label on cup
  │
  └── OrderForm  ← receives { name, warning, sku } + setters
        └── WhatsApp button → opens wa.me URL
```

---

## Error Handling & Edge Cases

- **GLB load failure:** Show a static fallback image (first product photo) with a text note
- **Long name/warning:** `drawLabel` clips text with `canvas.measureText` — no overflow onto static fields
- **Empty warning field:** The yellow box still renders, just empty — valid state, WhatsApp button enabled as long as name is filled
- **Mobile performance:** OrbitControls `enableDamping` kept on, but `autoRotate` disabled on touch devices to avoid fighting user gestures

---

## Out of Scope

- Saving orders to a database
- Payment processing
- Email confirmation
- Multiple label color themes
