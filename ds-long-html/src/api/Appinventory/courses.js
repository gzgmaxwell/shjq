// App管理/我的管理
import request from "@/api/axios";

// 获取表格数据
export function tabgetlist(info) {
  return request({
    url: "/system/web/system/app-module/page",
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

// 修改管理数据
export function restore(info) {
  return request({
    url: "/system/web/system/app-module/update",
    method: "post",
    data: info,
  });
}

// 修改管理数据
export function additional(info) {
  return request({
    url: "/system/web/system/app-module/save",
    method: "post",
    data: info,
  });
}

// 删除管理数据
export function deletelisttab(info) {
  return request({
    url: "/system/web/system/app-module/delete",
    method: "post",
    data: info,
  });
}
