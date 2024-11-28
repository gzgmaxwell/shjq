// 导航页管理
import request from "@/api/axios";

// 获取分类分类数据
export function fication(info) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: info,
  });
}

// 获取导航页表格数据
export function guided(info) {
  return request({
    url: "/substance/web/navigation/tree",
    method: "post",
    data: info,
  });
}

// 删除表格数据项
export function deletetablist(info) {
  return request({
    url: "/substance/web/navigation/delete",
    method: "post",
    data: info,
  });
}

// 获取视频标签数据
export function getAllLabelOfWeb(info) {
  return request({
    url: "/substance/web/label/list",
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

//推荐管理表格数据
export function recommends(info) {
  return request({
    url: "/substance/web/recommend/page",
    method: "post",
    data: info,
  });
}

// 排行管理表格数据
export function brothers(info) {
  return request({
    url: "/substance/web/rank/page",
    method: "post",
    data: info,
  });
}

// 新建与添加导航数据
export function navigationSave(info) {
  return request({
    url: "/substance/web/navigation/save",
    method: "post",
    data: info,
  });
}

// 编辑导航数据
export function navigationUpdate(info) {
  return request({
    url: "/substance/web/navigation/update",
    method: "post",
    data: info,
  });
}


// 编辑导航数据
export function langSaveBatch(info) {
  return request({
    url: "/system/web/system/lang/saveBatch",
    method: "post",
    data: info,
  });
}
