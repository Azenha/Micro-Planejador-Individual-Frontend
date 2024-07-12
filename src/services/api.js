import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Return normal response data
    return response.data
  },
  (error) => {
    // Log detailed error information to console
    console.error('API Error:', error)

    // Handle specific error cases as needed
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Status:', error.response.status)
      console.error('Response Data:', error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request)
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error Message:', error.message)
    }

    // Throw the error to continue handling in the caller
    throw error
  }
)

export default api
