import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const { userId } = params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    })
    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
