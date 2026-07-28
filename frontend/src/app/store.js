import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import productReducer from '../features/products/productSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    ui: uiReducer
  }
})
