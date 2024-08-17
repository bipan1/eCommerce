import { createSelector } from 'reselect'

const selectedCategories = (state) => state.category.data

const getCategoryId = (_, categoryId) => categoryId

export const getCategoryById = createSelector(
  selectedCategories,
  getCategoryId,
  (categories, categoryId) => {
    return categories.filter((category) => category.id == categoryId)[0].name
  },
)

export const getSubCategoryById = createSelector(
  selectedCategories,
  getCategoryId,
  (categories, categoryId) => {
    for (let category of categories) {
      const subcategory = category.subcategories.find(
        (sub) => sub.id == categoryId,
      )
      if (subcategory) {
        return subcategory.name
      }
    }
  },
)
