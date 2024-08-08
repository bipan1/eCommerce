import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk(
  'data/fetchProducts',
  async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product')
      return response.data.flattenProducts
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

export const products = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.data.push(action.payload)
    },
    removeProduct: (state, action) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      if (index !== -1) {
        state.data.splice(index, 1)
      }
    },
    editProduct: (state, action) => {
      console.log(action)
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = {
          ...action.payload,
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { addProduct, removeProduct, editProduct } = products.actions

export default products.reducer
