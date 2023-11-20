import { Alert } from 'react-native'
import axios from 'axios'
import config from './config'
const instance = axios.create({
  baseURL: config.url,
  timeout: 10000
})


export const get = async (url) => {
  const response = await instance.get(config.url + url).catch((error) => {
     Alert.alert('',error.response.data.error.message)
    return null
  })
  if (response) return response.data
  else return null
}
export const post = async (url, data,show=true) => {
  const response = await instance
    .post(config.url + url, data)
    .catch((error) => {
      if(show)
      {
        if(error.response)
          Alert.alert('',error.response.data.error.message)
      }
      return null
    })
  if (response?.data) return response.data
  else return null
}
export const put = async (url, data) => {
  const response = await instance.put(config.url + url, data).catch((error) => {
     Alert.alert('',error.response.data.error.message)
    return null
  })
  if (response) return response.data
  else return null
}
export const deleteReq = async (url) => {
  const response = await instance.delete(config.url + url).catch((error) => {
     Alert.alert('',error.response.data.error.message)
    return null
  })
  if (response) return response.data
  else return null
}
