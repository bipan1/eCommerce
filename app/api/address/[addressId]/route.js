import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const { addressId } = params

  try {
    const address = await prisma.address.findUnique({
      where: {
        id: parseInt(addressId),
      },
    })
    return NextResponse.json({ address }, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
