

import request from '@/api/axios'

export function fetchList (query) {
  return request({
    url: '/user/web/log/page',
    method: 'post',
    data: query
  })
}

export function delObj (id) {
  return request({
    url: '/user/web/log/del',
    method: 'post',
    data:{
      id:id
    }
  })
}

export function addObj (obj) {
  return request({
    url: '/user/web/log',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/user/web/log/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: '/user/web/log',
    method: 'put',
    data: obj
  })
}

