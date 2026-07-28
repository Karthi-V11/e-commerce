import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let queue = []

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('ss_refresh_token')
      if (!refreshToken) {
        localStorage.removeItem('ss_access_token')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        localStorage.setItem('ss_access_token', data.accessToken)
        queue.forEach((p) => p.resolve(data.accessToken))
        queue = []
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        queue.forEach((p) => p.reject(refreshError))
        queue = []
        localStorage.removeItem('ss_access_token')
        localStorage.removeItem('ss_refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
