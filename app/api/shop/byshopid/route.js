import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const url = new URL(req.url)
  const shopId = url.searchParams.get('shopId')
  try {
    const store = await prisma.store.findUnique({
      where: {
        store_id: parseInt(shopId),
      },
    })
    return NextResponse.json({ store }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}
