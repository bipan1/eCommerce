import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApiCall } from '@/utils/axiosApiCall'

// Async thunks for cart operations
export const fetchCart = createAsyncThunk('bag/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApiCall('/cart', 'GET')
    return response.data.items
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
  }
})

export const addItemToCart = createAsyncThunk('bag/addItemToCart', async (item, { rejectWithValue }) => {
  try {
    await axiosApiCall('/cart', 'POST', {
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })
    return item
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart')
  }
})

export const updateCartItemQuantity = createAsyncThunk('bag/updateCartItemQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    await axiosApiCall('/cart', 'PUT', { productId, quantity })
    return { productId, quantity }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
  }
})

export const removeCartItem = createAsyncThunk('bag/removeCartItem', async (productId, { rejectWithValue }) => {
  try {
    await axiosApiCall(`/cart?productId=${productId}`, 'DELETE')
    return productId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item')
  }
})

export const clearCart = createAsyncThunk('bag/clearCart', async (_, { rejectWithValue }) => {
  try {
    await axiosApiCall('/cart?clearAll=true', 'DELETE')
    return true
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
  }
})

const initialState = {
  numberOfItems: 0,
  items: [],
  isBagOpen: false,
  isSideBarOpen: false,
  loading: false,
  error: null,
}

export const bag = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    // Keep existing reducers for local state management and offline support
    addItem: (state, action) => {
      const { productId, quantity } = action.payload
      const existingItem = state.items.find(
        (item) => item.productId === productId,
      )
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + quantity
      } else {
        state.items = [...state.items, action.payload]
        state.numberOfItems += 1
      }
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(
        (cat) => cat.productId === action.payload,
      )
      if (index !== -1) {
        state.items.splice(index, 1)
        state.numberOfItems = state.numberOfItems - 1
      }
    },
    clearBag: (state) => {
      state.items = []
      state.numberOfItems = 0
    },
    openBag: (state) => {
      state.isBagOpen = true
    },
    closeBag: (state) => {
      state.isBagOpen = false
    },
    openSideBar: (state) => {
      state.isSideBarOpen = true
    },
    closeSideBar: (state) => {
      state.isSideBarOpen = false
    },
    increaseQuantity: (state, action) => {
      const index = state.items.findIndex(
        (cat) => cat.productId === action.payload,
      )
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          quantity: state.items[index].quantity + 1,
        }
      }
    },
    decreaseQuantity: (state, action) => {
      const index = state.items.findIndex(
        (cat) => cat.productId === action.payload,
      )
      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index] = {
            ...state.items[index],
            quantity: state.items[index].quantity - 1,
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.numberOfItems = action.payload.length
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false
        const { productId, quantity } = action.payload
        const existingItem = state.items.find(item => item.productId === productId)
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          state.items.push(action.payload)
          state.numberOfItems += 1
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false
        const { productId, quantity } = action.payload
        const index = state.items.findIndex(item => item.productId === productId)
        if (index !== -1) {
          if (quantity <= 0) {
            state.items.splice(index, 1)
            state.numberOfItems -= 1
          } else {
            state.items[index].quantity = quantity
          }
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false
        const productId = action.payload
        const index = state.items.findIndex(item => item.productId === productId)
        if (index !== -1) {
          state.items.splice(index, 1)
          state.numberOfItems -= 1
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false
        state.items = []
        state.numberOfItems = 0
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  addItem,
  removeItem,
  clearBag,
  openBag,
  closeBag,
  increaseQuantity,
  decreaseQuantity,
  openSideBar,
  closeSideBar,
  clearError,
} = bag.actions

export default bag.reducer
