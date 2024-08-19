import { createSelector } from 'reselect'

const selectProducts = (state) => state.products.data

const getId = (_, id) => id

export const getProductById = createSelector(
  selectProducts,
  getId,
  (products, id) => {
    return products.filter((product) => product.id == id)[0]
  },
)

export const getProductsByCategoryId = createSelector(
  selectProducts,
  getId,
  (products, id) => {
    return products.filter((item) => item.categoryId == id)
  },
)

export const getProductsBySubCategoryId = createSelector(
  selectProducts,
  getId,
  (products, id) => {
    return products.filter((item) => item.subcategoryId == id)
  },
)
