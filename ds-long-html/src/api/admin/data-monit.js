import request from '@/api/axios'

export function getData(data) {
    return request({
        url: '/leaf/web/leafAllocMonitor/db',
        data: data,
        method: 'post'
    })
}
