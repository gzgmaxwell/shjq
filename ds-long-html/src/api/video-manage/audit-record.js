import request from '@/api/axios'

// 获取视频记录列表数据
export function getVidTabData(data) {
    return request({
        url: '/examine/web/record/page',
        method: 'post',
        data: data
    })
}
// 获取评论记录列表数据
export function getPlTabData(data) {
    return request({
        url: '/substance/web/comment/auditRecordList',
        method: 'post',
        data: data
    })
}
// 获取弹幕记录列表数据
export function getDmTabData(data) {
    return request({
        url: '/substance/web/bullet/audit/page',
        method: 'post',
        data: data
    })
}
// 获取下架视频记录列表数据
export function getWgsVidTabData(data) {
    return request({
        url: '/substance/web/substance-online/offShelfPage',
        method: 'post',
        data: data
    })
}
// 根据ID进行线上视频的上下架
export function OnOrOffShelf(data) {
    return request({
        url: '/substance/web/substance-online/failure',
        method: 'post',
        data: data
    })
}
// 获取审核数量数据
export function getRecordData(data) {
    return request({
        url: '/examine/web/record/sta/all/record',
        method: 'post',
        data: data
    })
}
