import request from '@/api/axios'
// 查询
export function vidQueryList(data) {
    return request({
        url: '/accusation/web/accusation/doneList',
        method: 'post',
        data: data
    })
}
