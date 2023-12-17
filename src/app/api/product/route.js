import { prisma } from '@/database'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.json()
  const formattedData = { ...data, userId: Number(data.storeId) }

  try {
    const post = await prisma.product.create({ data: formattedData })
    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to add a post' }, { status: 500 })
  }
}
