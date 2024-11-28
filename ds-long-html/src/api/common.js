import request from "@/api/axios";

// 获取视频标签
export function getVidType(data) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: data,
  });
}
// 获取视频标签
export function getVidTag(data) {
  return request({
    url: "/substance/web/label/getAllLabelOfWeb",
    method: "post",
    data: data,
  });
}
// 获取视频标签
export function getVidViolationList(data) {
  return request({
    url: "/examine/web/refuse/list",
    method: "post",
    data: data,
  });
}
// 获取分类视频标签
export function getVidClassViolatList(data) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: data,
  });
}
// 获取审核用户
export function getExamineUser(data) {
  return request({
    url: "/examine/web/user/list",
    method: "post",
    data: data,
  });
}
// 获取视频编辑信息
export function getVidInfo(data) {
  return request({
    url: "/substance/web/substance-online/getInfoById",
    method: "post",
    data: data,
  });
}
// 查询
export function queryViolationTypeList(data) {
  return request({
    url: "/accusation/web/accusationClassify/list",
    method: "post",
    data: data,
  });
}

// 查询消息用户
export function querySmgUser(data) {
  return request({
    url: "/user/web/ds-user/page",
    method: "post",
    data: data,
  });
}

// 系统字典列表查询(多个key)
export function dictionaryQueryListByKeys(data) {
  return request({
    url: "/system/web/system/dictionary/queryListByKeys",
    method: "post",
    data: data,
  });
}
// 获取推荐级别
export function getReferralLevel(data) {
  return request({
    url: "/substance/web/referralPools/getReferralLevel",
    method: "get",
    params: data,
  });
}

export function getBindStatusByUsername(data) {
  return request({
    url: "prm/web/authenticator/getBindStatusByUsername/" + data,
    method: "get",
    data: data,
  });
}

export function bindGoogleAuthenticatorBySelf(data) {
  return request({
    url: "prm/web/authenticator/bindGoogleAuthenticatorBySelf",
    method: "post",
    data: data,
  });
}

export function classifyWebList(data) {
  return request({
    url: "/substance/web/classifyWeb/list",
    method: "get",
    data: data,
  });
}

export function packageAuditPage(data) {
  return request({
    url: "/marketing/web/distributor/package/audit/page",
    method: "post",
    data: data,
  });
}

export function package_record_page(data) {
  return request({
    url: "/marketing/web/distributor/package/record/page",
    method: "post",
    data: data,
  });
}

export function packageAuditHandle(data) {
  return request({
    url: "/marketing/web/distributor/package/audit/handle",
    method: "post",
    data: data,
  });
}

export function rejectAPI(data) {
  return request({
    url: "/substance/web/substance-pre/videoPage",
    method: "post",
    data: data,
  });
}
export function package_upload_url(data) {
  return request({
    url: "/marketing/web/distributor/package/upload/url",
    method: "post",
    data: data,
  });
}
export function uploadAPI(data) {
  return request({
    url: "/substance/web/substance-pre/videoPage",
    method: "post",
    data: data,
  });
}
export function packageAuditRemove(id) {
  return request({
    url: `/marketing/web/distributor/package/audit/remove/${id}`,
    method: "get",
  });
}
