import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/database'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    const data = await req.json()
    const { cartItems } = data

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      )
    }

    // Calculate server-side total by validating against database prices
    let calculatedTotal = 0
    
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId || item.id }
      })
      
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId || item.id} not found` },
          { status: 400 }
        )
      }
      
      // Use database price, not frontend price
      const price = product.isSpecial ? product.specialPrice : product.price
      calculatedTotal += parseFloat(price) * item.quantity
    }

    // Add shipping fee with free delivery for orders over $100
    const shippingFee = calculatedTotal > 100 ? 0.00 : 8.00
    const totalAmount = calculatedTotal + shippingFee

    // Create simplified cart summary for metadata (within 500 character limit)
    const cartSummary = cartItems.map(item => ({
      id: item.productId || item.id,
      qty: item.quantity
    }))

    // Create PaymentIntent with enhanced configuration for Google Pay and Apple Pay
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'aud',
      // Enable automatic payment methods including Google Pay and Apple Pay
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        // Store essential cart info for verification (within 500 char limit)
        cartSummary: JSON.stringify(cartSummary),
        userId: session?.user?.id || 'guest',
        calculatedTotal: totalAmount.toString(),
        itemCount: cartItems.length.toString()
      }
    })

    return NextResponse.json(
      { 
        client_secret: paymentIntent.client_secret,
        amount: totalAmount // Return server-calculated amount for frontend verification
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Stripe PaymentIntent creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
