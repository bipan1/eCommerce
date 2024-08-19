import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
    })
    return NextResponse.json({ orders }, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
