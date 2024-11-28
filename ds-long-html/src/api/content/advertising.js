// 广告管理
import request from "@/api/axios";

// 获取广告管理表格数据
export function tablist(info) {
  return request({
    url: "/marketing/web/advert/queryPageList",
    method: "post",
    data: info,
  });
}

// 删除广告管理表格数据
export function deletetab(info) {
  return request({
    url: "/marketing/web/advert/delete",
    method: "post",
    data: info,
  });
}

// 批量删除广告管理表格数据
export function deletelist(info) {
  return request({
    url: "/marketing/web/advert/batchDelete",
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

// 获取排序等级下拉数据
export function sortalgon(info) {
  return request({
    url: "/system/web/system/dictionary/queryList",
    method: "post",
    data: info,
  });
}

// 广告管理/广告编辑/获取广告位
export function seat(info) {
  return request({
    url: "/marketing/web/advert/queryAdvertLocation",
    method: "post",
    data: info,
  });
}

// 获取广告位所属位置下拉数据
export function place(info) {
  return request({
    url: "/substance/web/navigation/tree",
    method: "post",
    data: info,
  });
}

// 新建广告
export function addition(info) {
  return request({
    url: "/marketing/web/advert/save",
    method: "post",
    data: info,
  });
}

// 修改广告
export function modification(info) {
  return request({
    url: "/marketing/web/advert/update",
    method: "post",
    data: info,
  });
}

// 获取广告位列表数据
export function advertisingspace(info) {
  return request({
    url: "/marketing/web/advertLocation/queryLocationPageList",
    method: "post",
    data: info,
  });
}

// 删除广告位列表数据
export function deletespace(info) {
  return request({
    url: "/marketing/web/advertLocation/delete",
    method: "post",
    data: info,
  });
}

// 批量删除广告位列表数据
export function batchdelete(info) {
  return request({
    url: "/marketing/web/advertLocation/batchDelete",
    method: "post",
    data: info,
  });
}

// 新建广告位列表数据
export function savebuild(info) {
  return request({
    url: "/marketing/web/advertLocation/save",
    method: "post",
    data: info,
  });
}

// 编辑广告位列表数据
export function updateedit(info) {
  return request({
    url: "/marketing/web/advertLocation/update",
    method: "post",
    data: info,
  });
}

//广告位页面位置列表数据
export function regulation(info) {
  return request({
    url: "/marketing/web/advertLocation/getLocation",
    method: "post",
    data: info,
  });
}

//广告位固定位置下拉数据
export function advertLocationGetFixedType(info) {
  return request({
    url: "/marketing/web/advertLocation/getFixedType",
    method: "post",
    data: info,
  });
}
// export function add(data) {
//   return request({
//     url: "/video/app/minio/uploadSignUrl",
//     method: "post",
//     data: data,

//     // headers: {
//     //   "Content-Type": "multipart/form-data",
//     // },
//   });
// }
