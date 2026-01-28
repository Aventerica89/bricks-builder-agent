/**
 * Generate PNG icons using pure Node.js (no external dependencies)
 * Creates simple but professional-looking icons
 */

import { writeFileSync } from 'fs'

// PNG file structure helpers
function createPNG(width, height, pixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

  // IHDR chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type (RGBA)
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = createChunk('IHDR', ihdr)

  // IDAT chunk (image data)
  const rawData = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0 // filter byte
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4
      const dstIdx = y * (width * 4 + 1) + 1 + x * 4
      rawData[dstIdx] = pixels[srcIdx]     // R
      rawData[dstIdx + 1] = pixels[srcIdx + 1] // G
      rawData[dstIdx + 2] = pixels[srcIdx + 2] // B
      rawData[dstIdx + 3] = pixels[srcIdx + 3] // A
    }
  }

  // Simple zlib deflate (store only, no compression for simplicity)
  const deflated = deflateStore(rawData)
  const idatChunk = createChunk('IDAT', deflated)

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function createChunk(type, data) {
  const chunk = Buffer.alloc(12 + data.length)
  chunk.writeUInt32BE(data.length, 0)
  chunk.write(type, 4, 4, 'ascii')
  data.copy(chunk, 8)

  // CRC32
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = crc32(crcData)
  chunk.writeUInt32BE(crc >>> 0, 8 + data.length)

  return chunk
}

function deflateStore(data) {
  // Zlib header + stored blocks
  const blocks = []
  const BLOCK_SIZE = 65535

  // Zlib header (no compression)
  blocks.push(Buffer.from([0x78, 0x01]))

  for (let i = 0; i < data.length; i += BLOCK_SIZE) {
    const isLast = i + BLOCK_SIZE >= data.length
    const blockData = data.slice(i, Math.min(i + BLOCK_SIZE, data.length))
    const len = blockData.length

    // Block header
    const header = Buffer.alloc(5)
    header[0] = isLast ? 0x01 : 0x00
    header.writeUInt16LE(len, 1)
    header.writeUInt16LE(len ^ 0xFFFF, 3)

    blocks.push(header)
    blocks.push(blockData)
  }

  // Adler-32 checksum
  const adler = adler32(data) >>> 0  // Ensure unsigned
  const adlerBuf = Buffer.alloc(4)
  adlerBuf.writeUInt32BE(adler >>> 0, 0)
  blocks.push(adlerBuf)

  return Buffer.concat(blocks)
}

function crc32(data) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return crc ^ 0xFFFFFFFF
}

function adler32(data) {
  let a = 1, b = 0
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % 65521
    b = (b + a) % 65521
  }
  return (b << 16) | a
}

// Drawing helpers
function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4)

  // Background color (dark blue-gray)
  const bgDark = [15, 15, 26]
  const bgLight = [26, 26, 46]

  // Accent colors (cyan to emerald gradient)
  const accentCyan = [34, 211, 238]
  const accentEmerald = [16, 185, 129]

  // White for lines
  const white = [255, 255, 255]

  const padding = Math.floor(size / 8)
  const corner = Math.floor(size / 5)

  // Fill background with gradient
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4

      // Check if in rounded rect
      const inRect = isInRoundedRect(x, y, padding, padding, size - padding * 2, size - padding * 2, corner)

      if (inRect) {
        // Gradient from top-left to bottom-right
        const t = (x + y) / (size * 2)
        pixels[idx] = Math.floor(bgDark[0] + (bgLight[0] - bgDark[0]) * t)
        pixels[idx + 1] = Math.floor(bgDark[1] + (bgLight[1] - bgDark[1]) * t)
        pixels[idx + 2] = Math.floor(bgDark[2] + (bgLight[2] - bgDark[2]) * t)
        pixels[idx + 3] = 255
      } else {
        pixels[idx] = 0
        pixels[idx + 1] = 0
        pixels[idx + 2] = 0
        pixels[idx + 3] = 0
      }
    }
  }

  // Draw three horizontal lines (env var representation)
  const lineThickness = Math.max(1, Math.floor(size / 12))
  const lineY1 = Math.floor(size * 0.35)
  const lineY2 = Math.floor(size * 0.50)
  const lineY3 = Math.floor(size * 0.65)
  const lineX1 = Math.floor(size * 0.25)
  const lineX2a = Math.floor(size * 0.75)
  const lineX2b = Math.floor(size * 0.55)
  const lineX2c = Math.floor(size * 0.65)

  drawLine(pixels, size, lineX1, lineY1, lineX2a, lineY1, lineThickness, white, 230)
  drawLine(pixels, size, lineX1, lineY2, lineX2b, lineY2, lineThickness, white, 200)
  drawLine(pixels, size, lineX1, lineY3, lineX2c, lineY3, lineThickness, white, 180)

  // Draw accent dot (glowing effect)
  const dotX = Math.floor(size * 0.75)
  const dotY = Math.floor(size * 0.65)
  const dotRadius = Math.floor(size * 0.10)

  // Glow
  drawCircle(pixels, size, dotX, dotY, dotRadius + 2, accentCyan, 60)
  // Main dot with gradient
  drawGradientCircle(pixels, size, dotX, dotY, dotRadius, accentCyan, accentEmerald)

  return Buffer.from(pixels)
}

function isInRoundedRect(px, py, x, y, w, h, r) {
  // Check corners
  if (px < x + r && py < y + r) {
    return dist(px, py, x + r, y + r) <= r
  }
  if (px > x + w - r && py < y + r) {
    return dist(px, py, x + w - r, y + r) <= r
  }
  if (px < x + r && py > y + h - r) {
    return dist(px, py, x + r, y + h - r) <= r
  }
  if (px > x + w - r && py > y + h - r) {
    return dist(px, py, x + w - r, y + h - r) <= r
  }

  // Check inside rect
  return px >= x && px < x + w && py >= y && py < y + h
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function drawLine(pixels, size, x1, y1, x2, y2, thickness, color, alpha) {
  const halfT = thickness / 2
  for (let y = Math.max(0, y1 - thickness); y < Math.min(size, y1 + thickness); y++) {
    for (let x = Math.max(0, x1); x < Math.min(size, x2); x++) {
      if (Math.abs(y - y1) < halfT) {
        const idx = (y * size + x) * 4
        blendPixel(pixels, idx, color, alpha)
      }
    }
  }
}

function drawCircle(pixels, size, cx, cy, r, color, alpha) {
  for (let y = Math.max(0, cy - r - 2); y < Math.min(size, cy + r + 2); y++) {
    for (let x = Math.max(0, cx - r - 2); x < Math.min(size, cx + r + 2); x++) {
      const d = dist(x, y, cx, cy)
      if (d <= r) {
        const idx = (y * size + x) * 4
        blendPixel(pixels, idx, color, alpha)
      }
    }
  }
}

function drawGradientCircle(pixels, size, cx, cy, r, color1, color2) {
  for (let y = Math.max(0, cy - r); y < Math.min(size, cy + r + 1); y++) {
    for (let x = Math.max(0, cx - r); x < Math.min(size, cx + r + 1); x++) {
      const d = dist(x, y, cx, cy)
      if (d <= r) {
        const t = (x + y - (cx - r) - (cy - r)) / (r * 4)
        const color = [
          Math.floor(color1[0] + (color2[0] - color1[0]) * t),
          Math.floor(color1[1] + (color2[1] - color1[1]) * t),
          Math.floor(color1[2] + (color2[2] - color1[2]) * t)
        ]
        const idx = (y * size + x) * 4
        pixels[idx] = color[0]
        pixels[idx + 1] = color[1]
        pixels[idx + 2] = color[2]
        pixels[idx + 3] = 255
      }
    }
  }
}

function blendPixel(pixels, idx, color, alpha) {
  const a = alpha / 255
  pixels[idx] = Math.floor(pixels[idx] * (1 - a) + color[0] * a)
  pixels[idx + 1] = Math.floor(pixels[idx + 1] * (1 - a) + color[1] * a)
  pixels[idx + 2] = Math.floor(pixels[idx + 2] * (1 - a) + color[2] * a)
  pixels[idx + 3] = Math.max(pixels[idx + 3], alpha)
}

// Generate icons
const sizes = [16, 48, 128]

for (const size of sizes) {
  const pixels = drawIcon(size)
  const png = createPNG(size, size, pixels)
  writeFileSync(`icon${size}.png`, png)
  console.log(`Generated icon${size}.png`)
}

console.log('All icons generated!')
