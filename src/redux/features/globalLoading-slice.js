import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
}

export const loading = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true
    },
    stopLoading: (state) => {
      state.loading = false
    },
  },
})

export const { startLoading, stopLoading } = loading.actions
export default loading.reducer
