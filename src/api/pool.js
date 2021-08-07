import request from '@/utils/request'

export function getAllPools() {
  return request({
    url: '/api/v1/pool/getAll',
    method: 'get'
  })
}

export function testPic(poolID, multiMode) {
  return request({
    url: '/api/v1/gacha/testGacha',
    method: 'get',
    params: { poolID, multiMode }
  })
}

export function checkLikeStatus(poolID) {
  return request({
    url: '/api/v1/pool/checkLike',
    method: 'get',
    params: { poolID }
  })
}
export function setLike(poolID) {
  return request({
    url: '/api/v1/pool/setLike',
    method: 'get',
    params: { poolID }
  })
}
export function setUnLike(poolID) {
  return request({
    url: '/api/v1/pool/setUnLike',
    method: 'get',
    params: { poolID }
  })
}
