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

export async function uploadToS3(images) {
  return await Promise.all(
    images.map(async (file) => {
      const fileStream = Readable.from(file.stream())

      const s3upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: `images/${Date.now()}-${file.name}`,
          Body: fileStream,
        },
      })
      const res = await s3upload.done()
      return res.Location
    }),
  )
}
