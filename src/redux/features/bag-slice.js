import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  numberOfItems: 0,
  items: [],
  isBagOpen: false,
}

export const bag = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.numberOfItems = state.numberOfItems + 1
      state.items = [...state.items, action.payload]
    },
    removeItem: (state, action) => {
      state.numberOfItems = state.numberOfItems - 1
      state.items = [...state.items, action.payload]
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
  },
})

export const { addItem, removItem, clearBag, openBag, closeBag } = bag.actions
export default bag.reducer
