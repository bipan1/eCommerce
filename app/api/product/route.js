import prisma from '@/database'
import { NextResponse } from 'next/server'
import { uploadToS3 } from 'utils/uploadToS3'

export async function POST(req) {
  const formadata = await req.formData()
  let data = {}
  let image
  let imageUrl = ''
  for (const [key, value] of formadata.entries()) {
    if (key === 'files') {
      image = value
    } else {
      data[key] = value
    }
  }

  try {
    imageUrl = await uploadToS3(image)
  } catch (err) {
    console.log(err)
    NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }

  data = {
    name: data.name,
    description: data.description,
    image: imageUrl,
    subcategoryId: parseInt(data.subcategoryId),
    price: parseFloat(data.price),
  }

  try {
    const product = await prisma.product.create({
      data,
    })
    return NextResponse.json({ product }, { status: 200 })
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
    const products = await prisma.product.findMany({
      include: {
        subcategory: {
          select: {
            categoryId: true,
          },
        },
      },
    })
    const flattenProducts = products.map((product) => {
      const { subcategory, ...rest } = product
      return { ...rest, categoryId: subcategory.categoryId }
    })
    return NextResponse.json({ flattenProducts }, { status: 200 })
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
  let image
  let imageUrl
  for (const [key, value] of formadata.entries()) {
    if (key === 'files') {
      image = value
    } else {
      data[key] = value
    }
  }

  try {
    if (image) {
      imageUrl = await uploadToS3(image)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }

  data = {
    name: data.name,
    description: data.description,
    id: parseInt(data.id),
    image: imageUrl ? imageUrl : data.image,
    subcategoryId: parseInt(data.subcategoryId),
    price: parseFloat(data.price),
  }

  try {
    const product = await prisma.product.update({
      where: { id: data.id },
      data,
    })
    return NextResponse.json({ product }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error uploading image to s3' },
      { status: 500 },
    )
  }
}
