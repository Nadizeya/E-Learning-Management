import axios from 'axios'

const defaultBaseURL = 'http://localhost:8080/api'
const rawBaseURL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : defaultBaseURL
const baseURL = rawBaseURL.replace(/\/$/, '')

const apiClient = axios.create({
  baseURL,
})

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export default apiClient


