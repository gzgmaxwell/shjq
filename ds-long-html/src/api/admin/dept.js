

import request from '@/api/axios'

export function fetchDeptTree (query) {
  return request({
    url: '/prm/web/dept/user-tree',
    method: 'post',
    params: query
  })
}

export function fetchTree (query) {
  return request({
    url: '/prm/web/dept/tree',
    method: 'post',
    data: query,
  })
}

export function addObj (obj) {
  return request({
    url: '/prm/web/dept/save',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/prm/web/dept/infoById',
    method: 'post',
    data:{
      deptId:id
    }
  })
}

export function delObj (id) {
  return request({
    url: '/prm/web/dept/del',
    method: 'delete',
    data:{deptId:id},
  })
}

export function putObj (obj) {
  return request({
    url: '/prm/web/dept/update',
    method: 'post',
    data: obj
  })
}

export function getdetails (obj) {
  return request({
    url: '/prm/web/dept/details/infoByName',
    method: 'post',
    data:{
      name:obj,
    }
  })
}

