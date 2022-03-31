import axios from 'axios'
import { Message } from 'element-ui'

export const CancelRequests = []
const noMessageErrorURL = []
const noTimeoutURL = []

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30 * 1000,
  timeoutErrorMessage: '网络超时'
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 跳转下一个页面时，取消上一个页面未结束的请求
    config.cancelToken = new axios.CancelToken((cancel) => {
      CancelRequests.push({ cancel })
    })

    if (noTimeoutURL.includes(config.url)) {
      config.timeout = 0
    }

    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (res.code === 0) {
      return res.result
    } else {
      if (!noMessageErrorURL.includes(response.config.url)) {
        Message({
          message: res.message || '请求失败！',
          type: 'error'
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    // 取消请求时，会抛出 error，但无需错误提示
    if (axios.isCancel(error)) {
      return
    }

    Message({
      message: error || '请求失败！',
      type: 'error'
    })
    console.log('err' + error) // for debug

    return Promise.reject(error)
  }
)

export default service
