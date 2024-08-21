import Fuse from 'fuse.js'

let fuse

export function getSuggestions(searchTerm, products) {
  if (!fuse) {
    fuse = new Fuse(products, {
      keys: ['name', 'description'],
      threshold: 0.3,
    })
  }

  const searchItems = fuse.search(searchTerm)

  return searchItems.slice(0, 6)
}
