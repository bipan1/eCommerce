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

export async function PATCH(req) {
  try {
    const { orderId, status } = await req.json()
    
    // Validate required fields
    if (!orderId || !status) {
      return NextResponse.json({ 
        message: 'Order ID and status are required' 
      }, { status: 400 })
    }
    
    // Validate status value
    const validStatuses = ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        message: 'Invalid status value' 
      }, { status: 400 })
    }
    
    console.log(`Updating order ${orderId} to status ${status}`)
    
    // Check if order exists first
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })
    
    if (!existingOrder) {
      return NextResponse.json({ 
        message: 'Order not found' 
      }, { status: 404 })
    }
    
    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        products: true,
        shippingAddress: true,
        payment: true
      }
    })
    
    console.log(`Order ${orderId} successfully updated to ${status}`)
    
    return NextResponse.json({ 
      order: updatedOrder,
      message: 'Order status updated successfully' 
    }, { status: 200 })
    
  } catch (err) {
    console.error('Error updating order status:', err)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: err.message 
    }, { status: 500 })
  }
}
