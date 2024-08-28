import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  numberOfItems: 0,
  items: [],
  isBagOpen: false,
  isSideBarOpen: false,
}

export const bag = createSlice({
  name: 'bag',
  initialState,
  reducers: {
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
      }
      state.numberOfItems = state.numberOfItems - 1
    },
    clearBag: () => {
      return initialState
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
} = bag.actions
export default bag.reducer
