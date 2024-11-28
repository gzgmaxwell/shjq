import request from '@/api/axios'

export function getData(data) {
    return request({
        url: '/leaf/web/leafAllocMonitor/cache',
        data: data,
        method: 'post'
    })
}
