#!/bin/bash
# Generate simple placeholder icons using ImageMagick or a base64 embedded PNG

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
  for size in 16 48 128; do
    convert -size ${size}x${size} xc:#1a73e8 \
      -fill white -gravity center \
      -pointsize $((size/2)) -annotate 0 "K" \
      icon${size}.png
  done
  echo "Generated icons with ImageMagick"
else
  # Create minimal valid PNG files (1x1 blue pixel, scaled)
  # These are base64-encoded minimal PNGs
  echo "ImageMagick not found, creating minimal placeholder icons"
  
  # 16x16 blue PNG
  echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKElEQVR42mNgGAWjYBSMglEwCkYBHQATAwMDAwMDA8P/UcAIGAVDBQAAfJwCAW0sfZoAAAAASUVORK5CYII=" | base64 -d > icon16.png
  
  # 48x48 blue PNG  
  echo "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAPklEQVR42u3OMQEAAAgDoGn/zrb5CxTcQGnXkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJku4FAG/gAQGM4e4DAAAAAElFTkSuQmCC" | base64 -d > icon48.png
  
  # 128x128 blue PNG
  echo "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAS0lEQVR42u3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeA0YmAABVZxY3wAAAABJRU5ErkJggg==" | base64 -d > icon128.png
fi

echo "Icons created in $(pwd)"
