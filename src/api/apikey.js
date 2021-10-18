import request from '@/utils/request'

export function reGenAPIKey(regen = false) {
  return request({
    url: '/api/v1/APIKey/GenerateKey',
    method: 'get',
    params: { regen }
  })
}
