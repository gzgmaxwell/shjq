import request from '@/api/axios';
// 新增
export function addObj(data) {
    return request({
        url: '/accusation/web/accusationClassify/doSave',
        method: 'post',
        data: data
    })
}
// 查询
export function queryList(data) {
    return request({
        url: '/accusation/web/accusationClassify/list',
        method: 'post',
        data: data
    })
}
// 修改
export function editObj(data) {
    return request({
        url: '/accusation/web/accusationClassify/doRenew',
        method: 'post',
        data: data
    })
}
// 删除
export function delObj(data) {
    return request({
        url: '/accusation/web/accusationClassify/doRemove',
        method: 'post',
        data: data
    })
}
