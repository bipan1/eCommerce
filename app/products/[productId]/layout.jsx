'use server'
import prisma from '@/database'

export async function generateMetadata({ params }) {
	const id = Number(params.productId)
	if (Number.isNaN(id)) return {}
	const product = await prisma.product.findUnique({ where: { id }, include: { subcategory: { include: { category: true } } } })
	if (!product) return {}
	const title = `${product.name} | Sathiko Kirana Pasal`
	const description = product.description?.slice(0, 160) || 'Authentic Nepali groceries in Melbourne.'
	const url = `https://www.sathikokirana.com.au/products/${product.id}`
	return {
		title,
		description,
		keywords: [
			product.name,
			'Nepali grocery shop',
			'Nepali groceries Melbourne',
			'Nepali grocery store Melbourne',
			'Nepali ingredients',
			'Buy Nepali groceries online',
		],
		alternates: { canonical: `/products/${product.id}` },
		openGraph: { title, description, url, images: [{ url: product.image, width: 1200, height: 630, alt: product.name }], type: 'product' },
		twitter: { card: 'summary_large_image', title, description, images: [product.image] },
	}
}

export default function ProductLayout({ children }) {
	return children
}

export async function generateViewport() {
	return { themeColor: '#2C7A7B' }
}

export async function ProductJsonLd({ params }) {
	const id = Number(params.productId)
	if (Number.isNaN(id)) return null
	const product = await prisma.product.findUnique({ where: { id } })
	if (!product) return null
	const json = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		image: [product.image],
		description: product.description,
		brand: { '@type': 'Brand', name: 'Sathiko Kirana Pasal' },
		offers: {
			'@type': 'Offer',
			priceCurrency: 'AUD',
			price: String(product.isSpecial ? product.specialPrice : product.price),
			availability: product.outofStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
			url: `https://www.sathikokirana.com.au/products/${product.id}`,
		}
	}
	return (
		<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
	)
}

