import prisma from '@/database'

export default async function Head({ params }) {
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
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
		</>
	)
}

