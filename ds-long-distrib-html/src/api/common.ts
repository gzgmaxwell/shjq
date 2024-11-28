import request from "./request";

// 上传视频/图片时 获取桶名及信息
export function getBucketInfo(type: string) {
  return request({
    url: "/video/web/uploadInfo/" + type,
    method: "get",
  });
}
export function dowlodSensitiv(data?: any) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/template",
    method: "get",
    params: data,
  });
}

export function dictionaryQueryListByKeys(data: any) {
  return request({
    url: "/system/web/system/dictionary/queryChannelListByKeys",
    method: "post",
    data: data,
  });
}

export function updatePassword(data: any) {
  return request({
    url: "/prm/web/user/ext/update/password",
    method: "post",
    data: data,
  });
}

export function configGet() {
  return request({
    url: "/message/web/ext/config/get",
    method: "get",
  });
}

export function configSave(data: any) {
  return request({
    url: "/message/web/ext/config/save",
    method: "post",
    data: data,
  });
}

export function unreadCount() {
  return request({
    url: "/message/web/ext/message/get/unread/count",
    method: "post",
  });
}

export function getBindStatusByUsername(data?: any) {
  return request({
    url: "prm/web/authenticator/getBindStatusByUsername/" + data,
    method: "get",
    data: data,
  });
}
