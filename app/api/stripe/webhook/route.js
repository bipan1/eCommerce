import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        await handlePaymentSucceeded(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        await handlePaymentFailed(failedPayment)
        break

      case 'charge.dispute.created':
        const dispute = event.data.object
        await handleChargeDispute(dispute)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook handling error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  try {
    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        payment: {
          transactionId: paymentIntent.id
        }
      },
      include: {
        payment: true
      }
    })

    if (order) {
      // Update order status to confirmed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'APPROVED' }
      })

      console.log(`Order ${order.id} confirmed via webhook for payment ${paymentIntent.id}`)
    } else {
      console.warn(`No order found for payment intent ${paymentIntent.id}`)
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Log failed payment for investigation
    console.error(`Payment failed: ${paymentIntent.id}`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      last_payment_error: paymentIntent.last_payment_error
    })

    // You could also mark any associated order as failed
    // or send notifications to administrators
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleChargeDispute(dispute) {
  try {
    // Log dispute for manual review
    console.error(`Charge dispute created: ${dispute.id}`, {
      charge: dispute.charge,
      amount: dispute.amount,
      currency: dispute.currency,
      reason: dispute.reason
    })

    // You could implement logic to:
    // - Notify administrators
    // - Automatically provide evidence
    // - Update order status
  } catch (error) {
    console.error('Error handling charge dispute:', error)
  }
} 