import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.json()
  const formattedData = { ...data, userId: Number(data.userId) }

  try {
    const store = await prisma.store.create({ data: formattedData })
    return NextResponse.json({ store }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create a shop' },
      { status: 500 },
    )
  }
}

export async function GET(req) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  try {
    const stores = await prisma.store.findMany({
      where: {
        userId: parseInt(userId),
      },
    })
    return NextResponse.json({ stores }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}
