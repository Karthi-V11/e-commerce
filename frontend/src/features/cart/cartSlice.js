import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await axiosClient.get('/cart')
  return data
})

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }) => {
  const { data } = await axiosClient.post('/cart/items', { productId, quantity })
  return data
})

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }) => {
  const { data } = await axiosClient.patch(`/cart/items/${itemId}?quantity=${quantity}`)
  return data
})

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId) => {
  const { data } = await axiosClient.delete(`/cart/items/${itemId}`)
  return data
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    totalItems: 0,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (a) => [fetchCart.fulfilled, addToCart.fulfilled, updateCartItem.fulfilled, removeCartItem.fulfilled]
        .map((t) => t.type).includes(a.type),
      (state, action) => {
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.totalItems = action.payload.totalItems
        state.status = 'succeeded'
      }
    )
  }
})

export default cartSlice.reducer
