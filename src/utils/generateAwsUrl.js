import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export const generatePreSignedURL = async (fileName, fileType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  })

  const preSignedURL = await getSignedUrl(client, command, { expiresIn: 600 })
  return preSignedURL
}

export const uploadFileToS3 = async (file, preSignedURL) => {
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', preSignedURL)
  xhr.setRequestHeader('Content-Type', file.type)

  xhr.onload = (event) => {
    if (xhr.status === 200) {
      console.log('File uploaded successfully to S3')
    } else {
      console.error('Error uploading file to S3')
    }
  }

  xhr.onerror = (event) => {
    console.error('Error uploading file to S3')
  }

  xhr.send(file)
}
