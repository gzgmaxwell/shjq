// 分类即标签管理
import request from "@/api/axios";

// 获取父分类下拉数据
export function messagetion(info) {
  return request({
    url: "/substance/web/classify/getParentClassify",
    method: "post",
    data: info,
  });
}

//获取分类表格数据
// export function curriculum(info) {
//   return request({
//     url: "/substance/web/classify/list",
//     method: "post",
//     data: info,
//   });
// }
export function curriculum(info) {
  return request({
    url: "/substance/web/classify/newClassifyList",
    method: "post",
    data: info,
  });
}
export function newClassifyListForPlatForm(info) {
  return request({
    url: "/substance/web/classify/newClassifyListForPlatForm",
    method: "post",
    data: info,
  });
}

//新建分类
export function document(info) {
  return request({
    url: "/substance/web/classify/save",
    method: "post",
    data: info,
  });
}

//删除分类
export function removeby(info) {
  return request({
    url: "/substance/web/classify/remove",
    method: "post",
    data: info,
  });
}

//编辑分类
export function update(info) {
  return request({
    url: "/substance/web/classify/update",
    method: "post",
    data: info,
  });
}

//获取标签表格数据
export function listtab(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

//删除标签数据
export function tabremovelist(info) {
  return request({
    url: "/substance/web/label/remove",
    method: "post",
    data: info,
  });
}

//新建标签数据标签数据
export function builtfile(info) {
  return request({
    url: "/substance/web/label/save",
    method: "post",
    data: info,
  });
}

//编辑标签数据标签数据
export function recompose(info) {
  return request({
    url: "/substance/web/label/update",
    method: "post",
    data: info,
  });
}

//标签对应视频的数量
export function getVideoCount(info) {
  return request({
    url: "/substance/web/classify/getVideoCount",
    method: "post",
    data: info,
  });
}
// 后台标签
export function classifyWebPage(info) {
  return request({
    url: "/substance/web/classifyWeb/page",
    method: "post",
    data: info,
  });
}
export function saveOrUpdate(info) {
  return request({
    url: "/substance/web/classifyWeb/saveOrUpdate",
    method: "post",
    data: info,
  });
}
export function classifyWebDelete(info) {
  return request({
    url: "/substance/web/classifyWeb/delete",
    method: "post",
    data: info,
  });
}
