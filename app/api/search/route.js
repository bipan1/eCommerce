import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.searchParams)
    const searchTerm = searchParams.get('searchParams')
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
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
