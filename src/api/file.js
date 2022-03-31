import request from '@/utils/request'

export function uploadChunk(data, config = {}) {
  return request({
    url: '/file/upload/chunk',
    method: 'post',
    data,
    ...config
  })
}

export function mergeChunk(data) {
  return request({
    url: '/file/merge',
    method: 'post',
    data
  })
}
