import request from '@/api/axios'

// problem-type
// 新增
export function addTypeObj(data) {
    return request({
        url: '/system/web/system/problemClassify/doSave',
        method: 'post',
        data: data
    })
}
// 查询
export function queryTypeList(data) {
    return request({
        url: '/system/web/system/problemClassify/list',
        method: 'post',
        data: data
    })
}
// 修改
export function editTypeObj(data) {
    return request({
        url: '/system/web/system/problemClassify/doRenew',
        method: 'post',
        data: data
    })
}
// 删除
export function delTypeObj(data) {
    return request({
        url: '/system/web/system/problemClassify/doRemove',
        method: 'post',
        data: data
    })
}

// whole
// 新增
export function addObj(data) {
    return request({
        url: '/system/web/system/problem/doSave',
        method: 'post',
        data: data
    })
}
// 查询
export function queryList(data) {
    return request({
        url: '/system/web/system/problem/list',
        method: 'post',
        data: data
    })
}
// 修改
export function editObj(data) {
    return request({
        url: '/system/web/system/problem/doRenew',
        method: 'post',
        data: data
    })
}
// 删除
export function delObj(data) {
    return request({
        url: '/system/web/system/problem/doRemove',
        method: 'post',
        data: data
    })
}
// 设置常见
export function setList(data) {
    return request({
        url: '/system/web/system/problem/doNormal',
        method: 'post',
        data: data
    })
}
