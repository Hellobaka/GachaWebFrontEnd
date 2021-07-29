import request from '@/utils/request'

export function getAllPools() {
  return request({
    url: '/api/v1/pool/getAll',
    method: 'get'
  })
}

export function testPic(poolID, multiMode) {
  return request({
    url: '/api/v1/gacha/gacha',
    method: 'get',
    params: { poolID, multiMode }
  })
}
