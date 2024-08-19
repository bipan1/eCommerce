import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req) {
  const data = await req.json()
  const session = await getServerSession(authOptions)

  try {
    const address = await prisma.address.create({
      data: { ...data, postcode: parseInt(data.postcode) },
    })

    if (session) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { addressId: address.id },
      })
    }
    return NextResponse.json({ address }, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
