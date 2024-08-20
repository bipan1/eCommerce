import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApiCall } from 'utils/axiosApiCall'

export const fetchCategories = createAsyncThunk(
  'data/fetchCategories',
  async () => {
    try {
      const response = await axiosApiCall('/category')
      return response.data.category
    } catch (error) {
      throw error
    }
  },
)

const initialState = {
  loading: false,
  error: null,
  data: [],
}

export const category = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.data.push(action.payload)
    },
    removeCategory: (state, action) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      if (index !== -1) {
        state.data.splice(index, 1)
      }
    },
    editCategory: (state, action) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          name: action.payload.name,
        }
      }
    },
    addSubcategory: (state, action) => {
      const { categoryId, id, name } = action.payload
      const categoryIndex = state.data.findIndex((c) => c.id === categoryId)
      if (categoryIndex !== -1) {
        const updatedCategories = [...state.data]
        updatedCategories[categoryIndex].subcategories.push({ id, name })
        state = { ...state, data: updatedCategories }
      }
    },
    removeSubcategory: (state, action) => {
      const { categoryId, subcategoryId } = action.payload
      const categoryIndex = state.data.findIndex((c) => c.id === categoryId)
      if (categoryIndex !== -1) {
        const updatedCategories = [...state.data]
        const updatedSubcategories = [
          ...updatedCategories[categoryIndex].subcategories,
        ]
        const filteredSubcategories = updatedSubcategories.filter(
          (s) => s.id !== subcategoryId,
        )
        updatedCategories[categoryIndex].subcategories = filteredSubcategories
        state = { ...state, data: updatedCategories }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchCategories.rejected, (state) => {
      state.loading = false
    })
  },
})

export const {
  editCategory,
  addCategory,
  removeCategory,
  addSubcategory,
  removeSubcategory,
} = category.actions

export default category.reducer
