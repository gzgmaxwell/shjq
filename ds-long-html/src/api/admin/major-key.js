import request from '@/api/axios'

export function getMajorData(data) {
    return request({
        url: '/leaf/web/leafAlloc/page',
        data: data,
        method: 'post'
    })
}
export function addMajorData(data) {
    return request({
        url: '/leaf/web/leafAlloc/save',
        data: data,
        method: 'post'
    })
}
export function putMajorData(data) {
    return request({
        url: '/leaf/web/leafAlloc/update',
        data: data,
        method: 'post'
    })
}
export function delMajorData(data) {
    return request({
        url: '/leaf/web/leafAlloc/del',
        data: data,
        method: 'post'
    })
}
