import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req) {
  const data = await req.json()
  const session = await getServerSession(authOptions)

  const {
    products,
    shippingAddressId,
    addressData,
    paymentId,
    paymentMethod,
    amount,
    guestData,
  } = data

  return await prisma.$transaction(async (prisma) => {
    let createdAddressId
    let guestId

    if (!shippingAddressId) {
      const address = await prisma.address.create({
        data: { ...addressData, postcode: parseInt(addressData.postcode) },
      })
      createdAddressId = address.id
    }

    if (!session) {
      const guest = await prisma.guest.create({
        data: {
          ...guestData,
          addressId: createdAddressId,
        },
      })
      guestId = guest.id
    }

    const payment = await prisma.payment.create({
      data: {
        method: paymentMethod,
        transactionId: paymentId,
        amount: amount,
      },
    })

    const shippingId = shippingAddressId ? shippingAddressId : createdAddressId

    const order = await prisma.order.create({
      data: {
        ...(session ? { userId: session.user.id } : { guestId: guestId }),
        paymentId: payment.id,
        shippingAddressId: shippingId,
        status: 'PENDING',
        total: amount,
        products: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          })),
        },
      },
      include: {
        products: true,
      },
    })

    return NextResponse.json({ order }, { status: 200 })
  })
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany()
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}
