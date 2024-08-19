import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    isAuth: false,
    username: '',
    email: '',
  },
}

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (_, action) => {
      return {
        value: {
          isAuth: true,
          username: action.username,
          email: action.email,
          id: action.id,
          addressId: action.addressId,
        },
      }
    },
    logOut: () => {
      return initialState
    },
  },
})

export const { logIn, logOut } = auth.actions
export default auth.reducer
