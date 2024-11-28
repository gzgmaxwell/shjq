import request from "@/api/axios";

// 获取上传视频列表
export function getVideoList(query) {
  return request({
    url: "/examine/web/upload/draftPage",
    method: "get",
    params: query,
  });
}
// 发布视频
export function uplodRelease(data) {
  return request({
    url: "/examine/web/upload/submitAudit",
    method: "post",
    data: data,
  });
}
// 删除草稿箱视频
export function deletVideo(preId) {
  return request({
    url: "/examine/web/upload/del/" + preId,
    method: "post",
  });
}
// 上传视频/图片时 获取桶名及信息
export function getBucketInfo(type) {
  return request({
    url: "/video/web/uploadInfo/" + type,
    method: "get",
  });
}
