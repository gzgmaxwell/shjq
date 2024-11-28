// App管理/登录页管理
import request from "@/api/axios";

// 获取表格数据
export function queryList(info) {
  return request({
    url: "/system/web/system/logainPage/queryList",
    method: "post",
    data: info,
  });
}

// 删除表格数据
export function deletelist(info) {
  return request({
    url: "/system/web/system/logainPage/delete",
    method: "post",
    data: info,
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

// 添加视频表格数据
export function augment(info) {
  return request({
    url: "/system/web/system/logainPage/save",
    method: "post",
    data: info,
  });
}

// 添加视频表格数据
export function variation(info) {
  return request({
    url: "/system/web/system/logainPage/update",
    method: "post",
    data: info,
  });
}

// 视频推荐等级获取
export function recommend(info) {
  return request({
    url: "/system/web/system/dictionary/queryList",
    method: "post",
    data: info,
  });
}

// 添加App登录页
export function appLoginsave(params) {
  return request({
    url: "/system/web/system/appLogin/save",
    method: "post",
    data: params,
  });
}


// 添加App登录页
export function appLoginList(params) {
  return request({
    url: "/system/web/system/appLogin/list",
    method: "post",
    data: params,
  });
}

// 添加App登录页
export function appLoginDelete(params) {
  return request({
    url: "/system/web/system/appLogin/delete/" + params,
    method: "get",
  });
}

// 修改App登录页
export function appLoginUpdate(params) {
  return request({
    url: "/system/web/system/appLogin/update",
    method: "post",
    data: params,
  });
}









