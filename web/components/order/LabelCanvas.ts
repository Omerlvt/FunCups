export interface LabelFields {
  name: string
  warning: string
}

export function drawLabel(canvas: HTMLCanvasElement, fields: LabelFields): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('LabelCanvas: failed to get 2D context')
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
  // textBaseline explicitly reset to 'alphabetic' after header 'middle' usage

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
  ctx.fillText('MAY REFILL WHENEVER THE FEELS HIT', w * 0.03, baseY + lineH * 3)
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
      line = ctx.measureText(test).width > maxWidth
        ? clipText(ctx, test, maxWidth)
        : test
    }
  }
  if (line && drawn < maxLines) {
    ctx.fillText(clipText(ctx, line, maxWidth), x, currentY)
  }
}
