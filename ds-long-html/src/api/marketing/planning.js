// 内容中心/活动中心
import request from "@/api/axios";

// 获取活动列表数据
export function organization(info) {
  return request({
    url: "/marketing/web/activity/queryActivityList",
    method: "post",
    data: info,
  });
}

// 删除活动列表数据
export function listdelete(info) {
  return request({
    url: "/marketing/web/activity/delete",
    method: "post",
    data: info,
  });
}

export function activityOperate(id) {
  return request({
    url: "/marketing/web/activity/operate/" + id,
    method: "get",
  });
}

// 上传文件token传参获取
export function parameters(info) {
  return request({
    url: "/video/web/token",
    method: "post",
    data: info,
  });
}

export function webGetInfo(info) {
  return request({
    url: "/video/web/getInfo",
    method: "post",
    data: info,
  });
}

export function getS3Token(info) {
  return request({
    url: "/video/web/s3/token",
    method: "post",
    data: info,
  });
}

// 新增活动列表数据
export function joined(info) {
  return request({
    url: "/marketing/web/activity/save",
    method: "post",
    data: info,
  });
}

// 编辑活动列表数据
export function recompose(info) {
  return request({
    url: "/marketing/web/activity/update",
    method: "post",
    data: info,
  });
}

// 获取游戏列表数据
export function machineslist(info) {
  return request({
    url: "/marketing/web/game/queryGameList",
    method: "post",
    data: info,
  });
}

// 删除游戏列表数据
export function omit(info) {
  return request({
    url: "/marketing/web/game/delete",
    method: "post",
    data: info,
  });
}

// 添加游戏列表数据
export function affixion(info) {
  return request({
    url: "/marketing/web/game/save",
    method: "post",
    data: info,
  });
}

// 编辑游戏列表数据
export function amend(info) {
  return request({
    url: "/marketing/web/game/update",
    method: "post",
    data: info,
  });
}
