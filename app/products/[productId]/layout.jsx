// Avoid server-side DB calls here to prevent crashes on direct route access

export async function generateMetadata({ params }) {
	const id = Number(params.productId)
	if (Number.isNaN(id)) return {}
	const title = `Product ${id} | Sathiko Kirana Pasal`
	const description = 'Authentic Nepali groceries in Melbourne.'
	return {
		title,
		description,
		keywords: [
			'Nepali grocery shop',
			'Nepali groceries Melbourne',
			'Nepali grocery store Melbourne',
			'Nepali ingredients',
			'Buy Nepali groceries online',
		],
		alternates: { canonical: `/products/${id}` },
	}
}

export default function ProductLayout({ children }) {
	return children
}

// viewport is only supported in the root layout

// Product JSON-LD is injected from the client component in page.jsx to avoid server DB dependency during metadata generation

