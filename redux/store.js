import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import authReducer from './features/auth-slice'
import bagReducer from './features/bag-slice'
import loadingReducer from './features/globalLoading-slice'
import productsReducer from './features/products-slice'
import categotyReducer from './features/category-slice'
import { useDispatch, useSelector } from 'react-redux'
import { thunk } from 'redux-thunk'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bag: bagReducer,
    loading: loadingReducer,
    products: productsReducer,
    category: categotyReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: true,
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
