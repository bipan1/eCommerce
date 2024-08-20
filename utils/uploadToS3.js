import { S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function uploadToS3(image) {
  const fileStream = Readable.from(image.stream())

  const s3upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${Date.now()}-${image.name}`,
      Body: fileStream,
    },
  })
  const res = await s3upload.done()
  return res.Location
}

// import { writeFile } from 'fs/promises'
// import path from 'path'

// export async function uploadToS3(image) {
//   const buffer = Buffer.from(await image.arrayBuffer())
//   const filename = Date.now() + image.name.replaceAll(' ', '_')
//   await writeFile(path.join('public/uploads/' + filename), buffer)
//   return `/uploads/${filename}`
// }
