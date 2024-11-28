import request from '../request'

/**
 * 登录API
 * @param data {LoginData}
 * @returns
 */
export const authOauthToken = (
  username: string,
  password: string,
  code: string,
  randomStr: string
) => {
  const grantType = 'password'
  const scope = 'server'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      Authorization: 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: {
      username,
      password,
      randomStr,
      code,
      grant_type: grantType,
      scope
    }
  })
}

export const menuGetUserMenu = (id: any) => {
  return request({
    url: '/prm/web/menu/getUserMenu',
    data: { parentId: id },
    method: 'post'
  })
}

export const tokenLogout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}

export const getCheckCode = () => {
  const randomStr = Math.floor(Math.random() * 1000000000000)
  return request({
    url: `/code?randomStr=${randomStr}`,
    method: 'post',
    responseType: 'blob'
  })
}
