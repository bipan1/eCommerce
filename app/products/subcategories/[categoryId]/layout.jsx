'use server'
import prisma from '@/database'

export async function generateMetadata({ params }) {
	const id = Number(params.categoryId)
	if (Number.isNaN(id)) return {}
	const sub = await prisma.subcategory.findUnique({ where: { id } })
	if (!sub) return {}
	const title = `${sub.name} | Nepali Groceries in Melbourne | Sathiko Kirana Pasal`
	const description = `Shop ${sub.name} at Melbourne's Nepali grocery store. Authentic products and fast delivery.`
	return {
		title,
		description,
		keywords: [
			sub.name,
			`${sub.name} Melbourne`,
			'Nepali grocery shop',
			'Nepali groceries Melbourne',
			'Nepali grocery store Melbourne',
		],
		alternates: { canonical: `/products/subcategories/${id}` },
	}
}

export default function SubcategoryLayout({ children }) {
	return children
}

