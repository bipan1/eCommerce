import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
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

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ 
        message: 'Products are required and must be a non-empty array' 
      }, { status: 400 })
    }

    if (!paymentId || !paymentMethod || !amount) {
      return NextResponse.json({ 
        message: 'Payment information is required' 
      }, { status: 400 })
    }

    if (!session && !guestData) {
      return NextResponse.json({ 
        message: 'Guest data is required for non-authenticated users' 
      }, { status: 400 })
    }

    if (!shippingAddressId && !addressData) {
      return NextResponse.json({ 
        message: 'Shipping address information is required' 
      }, { status: 400 })
    }

    // CRITICAL: Verify payment with Stripe before creating order
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
      
      // Verify payment succeeded
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json({ 
          message: 'Payment has not been completed successfully' 
        }, { status: 400 })
      }

      // Verify payment amount matches the order total
      const expectedAmount = Math.round(amount)
      if (paymentIntent.amount !== expectedAmount) {
        return NextResponse.json({ 
          message: 'Payment amount mismatch detected' 
        }, { status: 400 })
      }

      // Check if order already exists for this payment (prevent duplicate orders)
      const existingOrder = await prisma.order.findFirst({
        where: {
          payment: {
            transactionId: paymentId
          }
        }
      })

      if (existingOrder) {
        return NextResponse.json({ 
          message: 'Order already exists for this payment',
          order: existingOrder
        }, { status: 409 })
      }

      // Validate product prices against database
      for (const product of products) {
        const dbProduct = await prisma.product.findUnique({
          where: { id: product.productId }
        })
        
        if (!dbProduct) {
          return NextResponse.json({ 
            message: `Product ${product.productId} not found` 
          }, { status: 400 })
        }

        const expectedUnitPrice = dbProduct.isSpecial ? dbProduct.specialPrice : dbProduct.price
        const frontendUnitPrice = parseFloat(product.price)
        
        // Compare unit prices (allowing for small floating point differences)
        if (Math.abs(frontendUnitPrice - parseFloat(expectedUnitPrice)) > 0.01) {
          console.error(`Price mismatch for product ${product.productId}:`, {
            frontend: frontendUnitPrice,
            database: parseFloat(expectedUnitPrice),
            difference: Math.abs(frontendUnitPrice - parseFloat(expectedUnitPrice))
          })
          return NextResponse.json({ 
            message: `Price mismatch for product ${product.productId}. Expected: $${expectedUnitPrice}, Got: $${frontendUnitPrice}` 
          }, { status: 400 })
        }
      }

    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError)
      return NextResponse.json({ 
        message: 'Payment verification failed' 
      }, { status: 400 })
    }

    const result = await prisma.$transaction(async (prisma) => {
      let createdAddressId
      let guestId

      // Create address if not provided
      if (!shippingAddressId) {
        const address = await prisma.address.create({
          data: { 
            ...addressData, 
            postcode: parseInt(addressData.postcode) 
          },
        })
        createdAddressId = address.id
      }

      // Create guest user if not authenticated
      if (!session) {
        const guest = await prisma.guest.create({
          data: {
            ...guestData,
            addressId: createdAddressId,
          },
        })
        guestId = guest.id
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          method: paymentMethod,
          transactionId: paymentId,
          amount: amount,
        },
      })

      const shippingId = shippingAddressId ? shippingAddressId : createdAddressId

      // Create order with products
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

      return order
    })

    return NextResponse.json({ 
      order: result,
      message: 'Order created successfully' 
    }, { status: 200 })

  } catch (error) {
    console.error('Error creating order:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2028') {
      return NextResponse.json({ 
        message: 'Database transaction error. Please try again.' 
      }, { status: 500 })
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Duplicate entry error. Please try again.' 
      }, { status: 400 })
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        message: 'Record not found. Please check your data.' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Failed to create order. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany()
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

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
