import request from "@/api/axios";
// 获取视频列表
export function getData(data) {
  return request({
    url: "/examine/web/work/order/page/pending/pre",
    method: "post",
    data: data,
  });
}
export function waitAssignPre(data) {
  return request({
    url: "/examine/web/work/order/wait/assign/pre",
    method: "post",
    data: data,
  });
}
// 待审核视频/分配接口
export function assignUser(data) {
  return request({
    url: "/examine/web/work/order/assign/user",
    method: "post",
    data: data,
  });
}
//异议池分配接口
export function disputeAssign(data) {
  return request({
    url: "/substance/web/substance-pre/dispute/assign",
    method: "post",
    data: data,
  });
}

// 开始任务分配
export function work(data) {
  return request({
    url: "/examine/web/user/editAssignType",
    method: "post",
    data: data,
  });
}
// 回退任务
export function Back(data) {
  return request({
    url: "/examine/web/work/order/rollbackExamine",
    method: "post",
    data: data,
  });
}

export function editorWork(data) {
  return request({
    url: "/examine/web/user/editor/work",
    method: "post",
    data: data,
  });
}

export function substancepreRollback(data) {
  return request({
    url: "/substance/web/substance-pre/rollback",
    method: "post",
    data: data,
  });
}

export function substancepreEdit(data) {
  return request({
    url: "/substance/web/substance-pre/edit",
    method: "post",
    data: data,
  });
}

export function countByChannel(data) {
  return request({
    url: "/substance/web/substance-pre/countByChannel",
    method: "post",
    data: data,
  });
}


