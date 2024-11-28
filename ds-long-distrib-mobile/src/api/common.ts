import request from './request'

export const getBucketInfo = (type: string) => {
  return request({
    url: `/video/web/uploadInfo/${type}`,
    method: 'get'
  })
}
export const dowlodSensitiv = (data: any) => {
  return request({
    url: '/checker/web/sensitive/sensitiveWords/template',
    method: 'get',
    params: data
  })
}
