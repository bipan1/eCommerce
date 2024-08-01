import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.json()

  const { userId, productId } = data
  const finalData = {
    ...data,
    userId: Number(userId),
    productId: Number(productId),
  }

  try {
    const category = await prisma.review.create({
      finalData,
    })
    NextResponse.json({ category }, { status: 200 })
  } catch (err) {
    console.log(err)
    NextResponse.json({ message: 'Error posting a review.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    const deletedProduct = await prisma.review.delete({
      where: {
        id: Number(id),
      },
    })

    return new Response(
      JSON.stringify({ message: 'Review deleted successfully' }),
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Error deleting review' }), {
      status: 500,
    })
  }
}
