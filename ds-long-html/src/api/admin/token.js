

import request from '@/api/axios'

export function fetchList (query) {
  return request({
    url: '/user/token/page',
    method: 'get',
    params: query
  })
}

export function delObj (token) {
  return request({
    url: '/user/token/' + token,
    method: 'delete'
  })
}
