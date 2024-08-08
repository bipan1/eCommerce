import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadToS3(image) {
  const buffer = Buffer.from(await image.arrayBuffer())
  const filename = Date.now() + image.name.replaceAll(' ', '_')
  await writeFile(path.join('public/uploads/' + filename), buffer)
  return `/uploads/${filename}`
}
