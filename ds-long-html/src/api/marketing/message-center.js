import request from '@/api/axios'

// 获取列表数据
export function queryList(data) {
    return request({
        url: '/message/web/message-sys/msg/searchMsg',
        method: 'post',
        data: data
    })
}
// 新增
export function addObj(data) {
    return request({
        url: '/message/web/message-sys/msg/send',
        method: 'post',
        data: data
    })
}
// 修改
export function putObj(data) {
    return request({
        url: '/message/web/message-sys/msg/modify',
        method: 'post',
        data: data
    })
}
// 修改详情
export function putObjView(data) {
    return request({
        url: '/message/web/message-sys/msg/getMsgSysById',
        method: 'post',
        data: data
    })
}
// 取消发送
export function cancel(data) {
    return request({
        url: '/message/web/message-sys/msg/cancleOrSend',
        method: 'post',
        data: data
    })
}
