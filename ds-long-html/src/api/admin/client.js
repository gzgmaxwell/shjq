/*
 * 请求
 */

import request from '@/api/axios'

export function fetchList (query) {
  return request({
    url: '/user/web/client/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/user/web/client',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/user/web/client/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/user/web/client/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/user/web/client',
    method: 'put',
    data: obj
  })
}
