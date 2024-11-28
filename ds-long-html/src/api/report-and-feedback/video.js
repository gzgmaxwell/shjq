import request from '@/api/axios'
// 查询
export function queryList(data) {
    return request({
        url: '/accusation/web/accusation/todoList',
        method: 'post',
        data: data
    })
}
// 举报处理
export function reportHandle(data) {
    return request({
        url: '/accusation/web/accusation/doHandle',
        method: 'post',
        data: data
    })
}
