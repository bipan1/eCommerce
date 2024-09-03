import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const { orderId } = params

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        user: true,
        Guest: true,
        products: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        payment: true,
      },
    })

    if (order) {
      return NextResponse.json({ order }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'Order not found' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { message: 'Error fetching order' },
      { status: 500 },
    )
  }
}
