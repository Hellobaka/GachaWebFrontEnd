import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/getuserinfo',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/api/v1/user/logout',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/v1/user/register',
    method: 'post',
    data
  })
}

export function verifyQQ(QQ) {
  return request({
    url: '/api/v1/user/verifyqq',
    method: 'get',
    params: { QQ }
  })
}

export function verifyEmail(email) {
  return request({
    url: '/api/v1/user/verifyemail',
    method: 'get',
    params: { email }
  })
}

export function verifyCaptcha(randstr, ticket, ip) {
  return request({
    url: '/api/v1/user/verifycaptcha',
    method: 'get',
    params: { randstr, ticket, ip }
  })
}

export function getEmailCaptcha(address) {
  return request({
    url: '/api/v1/user/getemailcaptcha',
    method: 'get',
    params: { address }
  })
}

export function verifyEmailCaptcha(code, sessionID) {
  return request({
    url: '/api/v1/user/verifyemailcaptcha',
    method: 'get',
    params: { code, sessionID }
  })
}

export function resetPwd(sessionID, newpwd) {
  return request({
    url: '/api/v1/user/resetpwd',
    method: 'get',
    params: { sessionID, newpwd }
  })
}
