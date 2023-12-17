import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth-slice'
import bagReducer from './features/bag-slice'
import loadingReducer from './features/globalLoading-slice'
import { useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bag: bagReducer,
    loading: loadingReducer,
  },
  devTools: true,
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
