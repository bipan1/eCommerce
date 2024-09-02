import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req) {
  const { phoneNumber } = await req.json()
  const session = await getServerSession(authOptions)

  try {
    if (session) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phoneNumber },
      })
      return NextResponse.json(
        { message: 'Phone number updated sucessfully.' },
        { status: 200 },
      )
    }
    return NextResponse.json({ error: 'Login first' }, { status: 400 })
  } catch (e) {
    console.log(e)
  }
}
