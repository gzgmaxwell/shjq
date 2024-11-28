import request from '@/api/axios'

// 获取列表
export function editionList(query) {
    return request({
        url: '/system/web/system/version/queryList',
        method: 'post',
        data: query
    })
}
// 新增
export function addObj(obj) {
    return request({
        url: '/system/web/system/version/save',
        method: 'post',
        data: obj
    })
}
// 修改
export function putObj(obj) {
    return request({
      url: '/system/web/system/version/update',
      method: 'post',
      data: obj
    })
  }
  // 删除
export function delObj(row) {
    return request({
      url: '/system/web/system/version/delete',
      method: 'post',
      data:{
        id:row
      },
    })
  }
