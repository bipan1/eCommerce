import prisma from '@/database'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(_, { params }) {
  const { userId } = params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // Use userId as string, don't parse as int
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    console.error('Error fetching user:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { userId } = params
  try {
    const body = await request.json()
    const { phoneNumber } = body
    
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phoneNumber,
      },
    })
    
    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    console.error('Error updating user:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
