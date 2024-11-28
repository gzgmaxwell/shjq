import request from '@/api/axios'

// 获取视频记录列表数据
export function getMyVidTabData(data) {
    return request({
        url: '/examine/web/record/self/page',
        method: 'post',
        data: data
    })
}
// 获取评论记录列表数据
export function getMyPlTabData(data) {
    return request({
        url: '/substance/web/comment/myAuditRecordList',
        method: 'post',
        data: data
    })
}
// 获取弹幕记录列表数据
export function getMyDmTabData(data) {
    return request({
        url: '/substance/web/bullet/audit/pageSelf',
        method: 'post',
        data: data
    })
}
// 获取个人审核数量数据
export function getRecordData(data) {
    return request({
        url: '/examine/web/record/sta/record',
        method: 'post',
        data: data
    })
}
