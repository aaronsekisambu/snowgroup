// Makes a 1200x630 copy of every service, project and product photo for link previews
// (WhatsApp, Facebook, LinkedIn, X), which crop anything else. Output: public/media/og/<folder>/<file>.jpg
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const mediaDir = path.join(process.cwd(), 'public/media')
const outDir = path.join(mediaDir, 'og')
const folders = ['services', 'projects', 'products']

let made = 0
for (const folder of folders) {
  const src = path.join(mediaDir, folder)
  if (!fs.existsSync(src)) continue
  fs.mkdirSync(path.join(outDir, folder), { recursive: true })

  for (const file of fs.readdirSync(src)) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue
    const out = path.join(outDir, folder, file.replace(/\.\w+$/, '.jpg'))
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(path.join(src, file)).mtimeMs) continue

    await sharp(path.join(src, file))
      .resize(1200, 630, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out)
    made++
  }
}

console.log(`og-images: ${made} preview image(s) generated`)
