import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApiCall } from 'utils/axiosApiCall'

export const fetchSearchProducts = createAsyncThunk(
  'data/fetchSearchProducts',
  async (searchParams) => {
    try {
      const response = await axiosApiCall(
        `/search?searchParams=${searchParams}`,
      )
      const products = response.data.flattenProducts
      const specials = products.filter((product) => product.isSpecial)
      return { products, specials }
    } catch (error) {
      throw error
    }
  },
)

const initialState = {
  loading: false,
  error: null,
  data: [],
  specials: [],
}

export const products = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSearchProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchSearchProducts.fulfilled, (state, action) => {
      const { specials, products } = action.payload
      state.loading = false
      state.data = products
      state.specials = specials
    })
    builder.addCase(fetchSearchProducts.rejected, (state) => {
      state.loading = false
    })
  },
})

export default products.reducer
