import request from "@/api/axios";
export function dsUserList(data) {
  return request({
    url: "/user/web/ds-user/list",
    method: "post",
    data,
  });
}
export function listUserIdByUsername(data) {
  return request({
    url: "/prm/web/user/listUserIdByUsername",
    method: "post",
    data,
  });
}

export function userlikePage(data) {
  return request({
    url: "/user/web/ds-user/likePage",
    method: "post",
    data,
  });
}

export function dsUserSave(data) {
  return request({
    url: "/user/web/ds-user/save",
    method: "post",
    data,
  });
}
export function dsUserUpdate(data) {
  return request({
    url: "/user/web/ds-user/update",
    method: "post",
    data,
  });
}
export function getSubstanceDataInfo(data) {
  return request({
    url: "/substance/web/substance-online/getSubstanceDataInfo",
    method: "post",
    data,
  });
}
export function dsUserResetPassword(id) {
  return request({
    url: "/user/web/ds-user/resetPassword",
    method: "get",
    params: { id },
  });
}
export function dsUserDelete(id) {
  return request({
    url: "/user/web/ds-user/delete",
    method: "get",
    params: { id },
  });
}
export function dsUserGetUserDetailInfo(id) {
  return request({
    url: "/user/web/ds-user/getUserDetailInfo",
    method: "get",
    params: { id },
  });
}
// 用户详细中金币明细
export function userGoldDetails(data) {
  return request({
    url: "/trade/web/userAccount/userGoldDetails",
    method: "post",
    data: data,
  });
}
// 用户详细中金币明细统计
export function userGoldStatistics(query) {
  return request({
    url: "/trade/web/userAccount/userGoldStatistics",
    method: "get",
    params: query,
  });
}
// 用户详细中订单详情
export function userOrderDetails(query) {
  return request({
    url: "/trade/web/userAccount/userOrderDetails",
    method: "get",
    params: query,
  });
}
// 密码加密
export function getKey(data) {
  return request({
    url: "/auth/app/getKey",
    method: "post",
    data,
  });
}
// 用户详细中观影卡明细
export function logsPage(data) {
  return request({
    url: "/marketing/web/props/videoCard/logsPage",
    method: "post",
    data,
  });
}
// 用户详细中观影卡明细统计
export function statistics(data) {
  return request({
    url: "/marketing/web/props/videoCard/statistics",
    method: "post",
    data,
  });
}

// 用户详细中会员道具明细
export function svipLogsPage(data) {
  return request({
    url: "/marketing/web/props/svip/logsPage",
    method: "post",
    data,
  });
}
// 用户详细中会员道具明细统计
export function svipStatistics(data) {
  return request({
    url: "/marketing/web/props/svip/statistics",
    method: "post",
    data,
  });
}

// 用户详细中积分明细
export function recordPage(data) {
  return request({
    url: "/marketing/web/integral/record/page",
    method: "post",
    data,
  });
}
// 用户详细中积分明细统计
export function recordSta(data) {
  return request({
    url: "/marketing/web/integral/record/sta",
    method: "post",
    data,
  });
}
// 任务中心金币明细
export function userTaskGoldDetails(data) {
  return request({
    url: "/trade/web/userAccount/userTaskGoldDetails",
    method: "post",
    data,
  });
}
