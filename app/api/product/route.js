import prisma from '@/database'
import { NextResponse } from 'next/server'
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

export async function POST(req) {
  const formadata = await req.formData()
  let data = {}
  const images = []
  let imageUrls = []
  for (const [key, value] of formadata.entries()) {
    if (key === 'files') {
      images.push(value)
    } else {
      data[key] = value
    }
  }

  try {
    imageUrls = await Promise.all(
      images.map(async (file) => {
        const fileStream = Readable.from(file.stream())

        const uploadTos3 = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.BUCKET_NAME,
            Key: `images/${Date.now()}-${file.name}`,
            Body: fileStream,
          },
        })
        const res = await uploadTos3.done()
        return res.Location
      }),
    )
  } catch (err) {
    console.log(err)
    NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }

  data = {
    ...data,
    images: imageUrls,
    categoryId: parseInt(data.categoryId),
    price: parseFloat(data.price),
    inventory: parseInt(data.inventory),
  }

  try {
    const product = await prisma.product.create({
      data,
    })
    return NextResponse.json({ product }, { status: 400 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json({ products }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}

export async function DELETE(req) {
  const { id } = await req.json()
  try {
    const product = await prisma.product.delete({ where: { id } })
    return NextResponse.json(
      { message: 'Product deleted Sucessfully' },
      { status: 200 },
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error Deleting Product' },
      { status: 500 },
    )
  }
}
