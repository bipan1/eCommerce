import prisma from '@/database'

export async function generateMetadata({ params }) {
	const id = Number(params.categoryId)
	if (Number.isNaN(id)) return {}
	const category = await prisma.category.findUnique({ where: { id } })
	if (!category) return {}
	const title = `${category.name} | Nepali Groceries in Melbourne | Sathiko Kirana Pasal`
	const description = `Shop ${category.name} at Melbourne's Nepali grocery store. Authentic products and fast delivery.`
	return {
		title,
		description,
		keywords: [
			category.name,
			`${category.name} Melbourne`,
			'Nepali grocery shop',
			'Nepali groceries Melbourne',
			'Nepali grocery store Melbourne',
		],
		alternates: { canonical: `/products/categories/${id}` },
		openGraph: { title, description },
	}
}

export default function CategoryLayout({ children }) {
	return children
}

