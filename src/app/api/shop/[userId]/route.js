import { prisma } from '@/database'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const url = new URL(req.url)
  const userId = parseInt(url.pathname.split('/').pop())

  try {
    const stores = await prisma.store.findMany({
      where: {
        userId: userId,
      },
    })
    return NextResponse.json({ stores }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}
