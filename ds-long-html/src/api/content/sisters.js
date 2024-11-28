// 排行管理
import request from "@/api/axios";

// 获取视频标签数据
export function messagetion(info) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: info,
  });
}

//排行管理/排行管理表格数据
export function recommends(info) {
  return request({
    url: "/substance/web/rank/page",
    method: "post",
    data: info,
  });
}

//排行管理/新增排行管理表格数据
export function newlyincreased(info) {
  return request({
    url: "/substance/web/rank/save",
    method: "post",
    data: info,
  });
}

//排行管理/删除排行管理表格数据
export function expurgate(info) {
  return request({
    url: "/substance/web/rank/delete",
    method: "post",
    data: info,
  });
}

//排行管理/排行信息编辑/修改排行信息
export function asymmetric(info) {
  return request({
    url: "/substance/web/rank/modify",
    method: "post",
    data: info,
  });
}

//排行管理/排行信息编辑/视频数据列表
// export function recommen(info) {
//   return request({
//     url: "/substance/web/rank/details/page",
//     method: "post",
//     data: info,
//   });
// }
export function recordPage(info) {
  return request({
    url: "/substance/web/rank/record/recordPage",
    method: "post",
    data: info,
  });
}

//排行管理/排行信息编辑/移除排行列表视频表格数据
// export function grain(info) {
//   return request({
//     url: "/substance/web/rank/deleteVideoFromRank",
//     method: "post",
//     data: info,
//   });
// }
export function deleteVideoFromRank(info) {
  return request({
    url: "/substance/web/rank/record/deleteVideoFromRank",
    method: "post",
    data: info,
  });
}

//排行管理/排行信息编辑/排行列表视频弹框/表格数据
// export function pagether(info) {
//   return request({
//     url: "/substance/web/rank/details/pageOther",
//     method: "post",
//     data: info,
//   });
// }
export function recordVideoPage(info) {
  return request({
    url: "/substance/web/rank/record/videoPage",
    method: "post",
    data: info,
  });
}

//排行管理/排行信息编辑/排行列表视频弹框/添加视频数据
// export function additionvideo(info) {
//   return request({
//     url: "/substance/web/rank/saveVideoToRank",
//     method: "post",
//     data: info,
//   });
// }
export function saveVideoToRank(info) {
  return request({
    url: "/substance/web/rank/record/saveVideoToRank",
    method: "post",
    data: info,
  });
}
//排行管理/排行信息编辑/修改排行名次
// export function modify(info) {
//   return request({
//     url: "/substance/web/rank/modifyVideoFromRank",
//     method: "post",
//     data: info,
//   });
// }
//排行管理/排行信息编辑/修改排行名次
export function modifyVideoFromRank(info) {
  return request({
    url: "/substance/web/rank/record/modifyVideoFromRank",
    method: "post",
    data: info,
  });
}
//排行管理/热门标签获取
export function hotlabels(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

//排行管理/新增热门标签
export function savetablist(info) {
  return request({
    url: "/substance/web/label/save",
    method: "post",
    data: info,
  });
}

//排行管理/删除标签
export function removetab(info) {
  return request({
    url: "/substance/web/label/remove",
    method: "post",
    data: info,
  });
}
