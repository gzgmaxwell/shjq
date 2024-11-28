// 推荐管理
import request from "@/api/axios";

// 获取视频标签数据
export function messagetion(info) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐管理表格数据
export function recommends(info) {
  return request({
    url: "/substance/web/recommend/page",
    method: "post",
    data: info,
  });
}

//推荐管理/新增推荐管理表格数据
export function newlyincreased(info) {
  return request({
    url: "/substance/web/recommend/save",
    method: "post",
    data: info,
  });
}

//推荐管理/删除推荐管理表格数据
export function expurgate(info) {
  return request({
    url: "/substance/web/recommend/delete",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐信息编辑/修改推荐信息
export function asymmetric(info) {
  return request({
    url: "/substance/web/recommend/modify",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐信息编辑/视频数据列表
// export function recommen(info) {
//   return request({
//     url: "/substance/web/recommend/details/page",
//     method: "post",
//     data: info,
//   });
// }
export function recordPage(info) {
  return request({
    url: "/substance/web/recommend/record/recordPage",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐信息编辑/移除推荐列表视频表格数据
// export function grain(info) {
//   return request({
//     url: "/substance/web/recommend/deleteVideoToRecommend",
//     method: "post",
//     data: info,
//   });
// }
export function deleteVideoToRecommend(info) {
  return request({
    url: "/substance/web/recommend/record/deleteVideoToRecommend",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐信息编辑/推荐列表视频弹框/表格数据
// export function pagether(info) {
//   return request({
//     url: "/substance/web/recommend/details/pageOther",
//     method: "post",
//     data: info,
//   });
// }
export function recordVideoPage(info) {
  return request({
    url: "/substance/web/recommend/record/videoPage",
    method: "post",
    data: info,
  });
}

//推荐管理/推荐信息编辑/推荐列表视频弹框/添加视频数据
// export function additionvideo(info) {
//   return request({
//     url: "/substance/web/recommend/saveVideoToRecommend",
//     method: "post",
//     data: info,
//   });
// }
export function saveVideoToRecommend(info) {
  return request({
    url: "/substance/web/recommend/record/saveVideoToRecommend",
    method: "post",
    data: info,
  });
}
//推荐管理/热门标签获取
export function hotlabels(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

//推荐管理/新增热门标签
export function savetablist(info) {
  return request({
    url: "/substance/web/label/save",
    method: "post",
    data: info,
  });
}

//推荐管理/删除标签
export function removetab(info) {
  return request({
    url: "/substance/web/label/remove",
    method: "post",
    data: info,
  });
}

// 根据id查询视频数据
export function compiletab(info) {
  return request({
    url: "/substance/web/substance-online/getInfoById",
    method: "post",
    data: info,
  });
}

// 推荐列表调整权重
export function updateRecommendVideoWeight(data) {
  return request({
    url: "/substance/web/recommend/record/updateRecommendVideoWeight",
    method: "post",
    data,
  });
}
