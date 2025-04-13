import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/slices/authSlice'
import cartSlice from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})