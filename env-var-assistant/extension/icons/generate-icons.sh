#!/bin/bash
# Generate modern SaaS-style icons for Env Vault

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
  echo "ImageMagick not found. Please install it: brew install imagemagick"
  exit 1
fi

# Create a temporary SVG for each size
create_icon() {
  local size=$1
  local padding=$((size / 8))
  local inner=$((size - padding * 2))
  local corner=$((size / 5))
  local stroke=$((size / 16))
  if [ $stroke -lt 1 ]; then stroke=1; fi

  cat > "icon_temp.svg" << EOF
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0f0f1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22d3ee"/>
      <stop offset="100%" style="stop-color:#10b981"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${corner}" fill="url(#bg)"/>

  <!-- Border glow -->
  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${corner}" fill="none" stroke="url(#accent)" stroke-width="0.5" opacity="0.3"/>

  <!-- Lines representing env vars -->
  <g stroke="white" stroke-width="${stroke}" stroke-linecap="round" opacity="0.9">
    <line x1="$((size * 25 / 100))" y1="$((size * 35 / 100))" x2="$((size * 75 / 100))" y2="$((size * 35 / 100))"/>
    <line x1="$((size * 25 / 100))" y1="$((size * 50 / 100))" x2="$((size * 55 / 100))" y2="$((size * 50 / 100))"/>
    <line x1="$((size * 25 / 100))" y1="$((size * 65 / 100))" x2="$((size * 65 / 100))" y2="$((size * 65 / 100))"/>
  </g>

  <!-- Accent dot (key indicator) -->
  <circle cx="$((size * 75 / 100))" cy="$((size * 65 / 100))" r="$((size * 8 / 100))" fill="url(#accent)" filter="url(#glow)"/>
</svg>
EOF

  convert -background none "icon_temp.svg" "icon${size}.png"
  rm "icon_temp.svg"
  echo "Generated icon${size}.png"
}

# Generate all sizes
create_icon 16
create_icon 48
create_icon 128

echo "All icons generated successfully!"
