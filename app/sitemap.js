import prisma from '@/database'

export default async function sitemap() {
	const baseUrl = 'https://www.sathikokirana.com.au'

	const staticRoutes = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{ url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
		{ url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
		{ url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
		{ url: `${baseUrl}/flash-deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
		{ url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
		{ url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
		{ url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
		{ url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
	]

	// Pull dynamic slugs
	const [categories, subcategories, products] = await Promise.all([
		prisma.category.findMany({ select: { id: true } }),
		prisma.subcategory.findMany({ select: { id: true } }),
		prisma.product.findMany({ select: { id: true, updatedAt: true } }),
	])

	const categoryRoutes = categories.map((c) => ({
		url: `${baseUrl}/products/categories/${c.id}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.7,
	}))

	const subcategoryRoutes = subcategories.map((s) => ({
		url: `${baseUrl}/products/subcategories/${s.id}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.7,
	}))

	const productRoutes = products.map((p) => ({
		url: `${baseUrl}/products/${p.id}`,
		lastModified: p.updatedAt ?? new Date(),
		changeFrequency: 'weekly',
		priority: 0.6,
	}))

	return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes, ...productRoutes]
}