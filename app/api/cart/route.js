import prisma from '@/database'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

// GET - Get user's cart items
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    // Format cart items with current database prices (not stored prices)
    const formattedItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.product.isSpecial ? item.product.specialPrice : item.product.price),
      name: item.product.name,
      image: item.product.image
    }))

    return NextResponse.json({ items: formattedItems }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity, price } = await req.json()

    if (!productId || !quantity) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate product exists and get current price from database
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Use database price instead of frontend price
    const actualPrice = product.isSpecial ? product.specialPrice : product.price

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    })

    if (existingItem) {
      // Update existing item quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + quantity,
          price: parseFloat(actualPrice) // Update price to current database price
        }
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: quantity,
          price: parseFloat(actualPrice) // Use database price, not frontend price
        }
      })
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 })
  } catch (error) {
    console.error('Error adding item to cart:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update item quantity
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      })
    } else {
      // Update quantity
      await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          productId: parseInt(productId)
        },
        data: { quantity: quantity }
      })
    }

    return NextResponse.json({ message: 'Cart updated' }, { status: 200 })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const clearAll = searchParams.get('clearAll')

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 })
    }

    if (clearAll === 'true') {
      // Clear all items from cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
      return NextResponse.json({ message: 'Cart cleared' }, { status: 200 })
    } else if (productId) {
      // Remove specific item
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      })
      return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'Missing productId or clearAll parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error removing item from cart:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
} 