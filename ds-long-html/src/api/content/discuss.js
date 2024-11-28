// 评论审核
import request from "@/api/axios";

//评论审核/评论列表
export function discuss(info) {
  return request({
    url: "/substance/web/comment/auditList",
    method: "post",
    data: info,
  });
}

//评论审核/评论列表/评论审核操作
export function check(info) {
  return request({
    url: "/substance/web/comment/doAudit",
    method: "post",
    data: info,
  });
}

//评论审核/弹幕列表
export function barrage(info) {
  return request({
    url: "/substance/web/bullet/page",
    method: "post",
    data: info,
  });
}

//评论审核/弹幕列表审核操作
export function inaugurate(info) {
  return request({
    url: "/substance/web/bullet/review",
    method: "post",
    data: info,
  });
}
// 弹幕
export function bulletDelete(info) {
  return request({
    url: "/substance/web/bullet/delete",
    method: "post",
    data: info,
  });
}
//弹幕批量删除
export function auditDeleteBatch(info) {
  return request({
    url: "/substance/web/bullet/audit/deleteBatch",
    method: "post",
    data: info,
  });
}
