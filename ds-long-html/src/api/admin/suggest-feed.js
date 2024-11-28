import request from '@/api/axios'

// 获取列表
export function queryList(query) {
    return request({
        url: '/system/web/system/feedback/list',
        method: 'post',
        data: query
    })
}
// 回复
export function reply(query) {
    return request({
        url: '/system/web/system/feedback/doReply',
        method: 'post',
        data: query
    })
}
