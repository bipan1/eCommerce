'use client'
import axios from 'axios'

export const axiosApiCall = async (endpoint, method = 'GET', data) => {
  let response

  const apiAddress = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`
  let contentType = 'application/json'

  if (endpoint === '/product') {
    contentType = 'multipart/form-data'
  }

  const headers = {
    'Content-Type': contentType,
  }

  if (method === 'GET') {
    response = await axios.get(apiAddress)
  } else if (method === 'POST') {
    response = await axios.post(apiAddress, data, headers)
  } else if (method === 'DELETE') {
    response = await axios.delete(apiAddress, data, headers)
  } else if (method === 'PUT') {
    response = await axios.put(apiAddress, data, headers)
  }

  return response
}
