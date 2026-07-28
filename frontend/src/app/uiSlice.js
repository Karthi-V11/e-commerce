import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('ss_dark') || 'false')
    : false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('ss_dark', JSON.stringify(state.darkMode))
    }
  }
})

export const { toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer
