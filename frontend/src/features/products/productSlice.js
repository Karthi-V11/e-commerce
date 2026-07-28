import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}) => {
  const { data } = await axiosClient.get('/products', { params })
  return data
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.content = action.payload.page > 0
          ? [...state.content, ...action.payload.content]
          : action.payload.content
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export default productSlice.reducer
