import prisma from '@/database'
import { NextResponse } from 'next/server'
import { uploadToS3 } from 'utils/uploadToS3'

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
    imageUrls = await uploadToS3(images)
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

export async function PUT(req) {
  const formadata = await req.formData()
  let data = {}
  const images = []
  let imageUrls = []
  let oldImages = []
  for (const [key, value] of formadata.entries()) {
    if (key === 'files') {
      images.push(value)
    } else if (key === 'oldImages') {
      oldImages.push(value)
    } else {
      data[key] = value
    }
  }

  try {
    imageUrls = await uploadToS3(images)
  } catch (err) {
    console.log(err)
    NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }

  data = {
    ...data,
    id: parseInt(data.id),
    images: [...imageUrls, ...oldImages],
    categoryId: parseInt(data.categoryId),
    price: parseFloat(data.price),
    inventory: parseInt(data.inventory),
  }

  try {
    const product = await prisma.product.update({
      where: { id: data.id },
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
