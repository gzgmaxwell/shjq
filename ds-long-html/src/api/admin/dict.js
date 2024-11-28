
import request from '@/api/axios'

// 获取字典列表
export function fetchList(query) {
  return request({
    url: '/system/web/system/dictionary/queryList',
    method: 'post',
    data: query
  })
}

//
export function fetchItemList(query) {
  return request({
    url: '/user/web/dict/item/page',
    method: 'post',
    data: query
  })
}

export function addItemObj(obj) {
  return request({
    url: '/',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) {
  return request({
    url: '/user/web/dict/item/infoById',
    method: 'post',
    data:{
      id:id
    }
  })
}

export function delItemObj(id) {
  return request({
    url: '/user/web/dict/item/del',
    method: 'post',
    data:{
      id:id
    }
  })
}

export function putItemObj(obj) {
  return request({
    url: '/user/web/dict/item/update',
    method: 'post',
    data: obj
  })
}
// 新增字典列表项
export function addObj(obj) {
  return request({
    url: '/system/web/system/dictionary/save',
    method: 'post',
    data: obj
  })
}
// 查询字典列表项
export function getObj(id) {
  return request({
    url: '/user/web/dict/infoById',
    method: 'post',
    data:{
      id:id,
    }
  })
}
// 删除字典列表项
export function delObj(row) {
  return request({
    url: '/system/web/system/dictionary/delete',
    method: 'post',
    data:{
      id:row.id
    },
  })
}
// 修改字典列表项
export function putObj(obj) {
  return request({
    url: '/system/web/system/dictionary/update',
    method: 'post',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/user/web/dict/type',
    method: 'post',
    data:{
      type:type,
    },
  })
}
