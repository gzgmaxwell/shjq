import request from '@/api/axios'

// 获取视频记录列表数据
export function getData(data) {
    return request({
        url: '/examine/web/strategy/page',
        method: 'post',
        data: data
    })
}
export function addForm(data) {
    return request({
        url: '/examine/web/strategy/save',
        method: 'post',
        data: data
    })
}
export function deleteData(data) {
    return request({
        url: '/examine/web/strategy/remove',
        method: 'post',
        data: data
    })
}
export function editData(data) {
    return request({
        url: '/examine/web/strategy/edit',
        method: 'post',
        data: data
    })
}
