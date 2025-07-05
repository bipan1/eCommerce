import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get('q') || searchParams.get('searchParams') // Support both for backward compatibility
    const limit = parseInt(searchParams.get('limit')) || 20 // Default to 20, can be set to 5 for suggestions
    
    // Return empty results if no search term
    if (!searchTerm || searchTerm.trim().length === 0) {
      return NextResponse.json({ 
        products: [], 
        total: 0, 
        searchTerm: '',
        limit 
      }, { status: 200 })
    }

    const trimmedSearchTerm = searchTerm.trim()

    // Get total count for the search
    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: trimmedSearchTerm, mode: 'insensitive' } },
          { description: { contains: trimmedSearchTerm, mode: 'insensitive' } },
        ],
      },
    })

    // Get the products with limit
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: trimmedSearchTerm, mode: 'insensitive' } },
          { description: { contains: trimmedSearchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        subcategory: {
          select: {
            name: true,
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: [
        // Prioritize exact name matches
        { name: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Format the response with flattened data
    const flattenProducts = products.map((product) => {
      const { subcategory, ...rest } = product
      return { 
        ...rest, 
        categoryId: subcategory?.categoryId,
        categoryName: subcategory?.category?.name,
        subcategoryName: subcategory?.name,
      }
    })

    // For backward compatibility, include both response formats
    return NextResponse.json({ 
      products: flattenProducts,
      flattenProducts, // Keep for backward compatibility
      total: totalCount,
      searchTerm: trimmedSearchTerm,
      limit,
      hasMore: totalCount > limit
    }, { status: 200 })

  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json({ 
      message: 'Error searching products',
      error: err.message,
      products: [],
      total: 0
    }, { status: 500 })
  }
}
