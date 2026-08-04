import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

function extractErrorMessage(err, fallback) {
  if (err.response) {
    // Backend responded — use its message (validation error, bad credentials, etc.)
    return err.response.data?.message || `${fallback} (server responded ${err.response.status})`
  }
  if (err.request) {
    // Request was sent but no response came back — almost always CORS or backend not running.
    console.error('No response from backend. Check: (1) backend running on the expected port, ' +
      '(2) VITE_API_BASE_URL matches it, (3) CORS_ORIGINS on the backend includes this origin.', err)
    return `${fallback}: could not reach the server. Is the backend running? (See console for details.)`
  }
  console.error(err)
  return `${fallback}: ${err.message}`
}

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/auth/login', payload)
    return data
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Login failed'))
  }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/auth/register', payload)
    return data
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Registration failed'))
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axiosClient.post('/auth/logout')
  } catch (err) {
    // Even if the server call fails (e.g. token already expired), we still clear locally.
  }
  return true
})

const persisted = {
  accessToken: localStorage.getItem('ss_access_token') || null,
  refreshToken: localStorage.getItem('ss_refresh_token') || null,
  user: JSON.parse(localStorage.getItem('ss_user') || 'null')
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...persisted,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      localStorage.removeItem('ss_access_token')
      localStorage.removeItem('ss_refresh_token')
      localStorage.removeItem('ss_user')
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher((a) => a.type === login.pending.type || a.type === register.pending.type, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addMatcher((a) => a.type === login.fulfilled.type || a.type === register.fulfilled.type, (state, action) => {
        state.status = 'succeeded'
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        localStorage.setItem('ss_access_token', action.payload.accessToken)
        localStorage.setItem('ss_refresh_token', action.payload.refreshToken)
        localStorage.setItem('ss_user', JSON.stringify(action.payload.user))
      })
      .addMatcher((a) => a.type === login.rejected.type || a.type === register.rejected.type, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
