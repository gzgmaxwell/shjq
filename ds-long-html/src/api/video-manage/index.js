import request from "@/api/axios";

export function substancePreSubmitDraft(data) {
  return request({
    url: "/substance/web/substance-pre/submitDraft",
    method: "post",
    data: data,
  });
}

export function substancePreVideoPage(data) {
  return request({
    url: "/substance/web/substance-pre/videoPage",
    method: "post",
    data: data,
  });
}

export function supplierVideoPage(data) {
  return request({
    url: "/substance/web/substance-pre/supplier/videoPage",
    method: "post",
    data: data,
  });
}

export function substancePreDel(data) {
  return request({
    url: "/substance/web/substance-pre/del/" + data,
    method: "post",
  });
}

export function substancePreSubmitAudit(data) {
  return request({
    url: "/substance/web/substance-pre/submitAudit",
    method: "post",
    data: data,
  });
}

export function getWebCreateAppUserInfo(data) {
  return request({
    url: "/user/web/ds-user/getWebCreateAppUserInfo",
    method: "get",
    params: data,
  });
}

export function examineFirstReview(data) {
  return request({
    url: "/examine/web/work/order/examine/firstReview",
    method: "post",
    data: data,
  });
}

export function examineSecondReview(data) {
  return request({
    url: "/examine/web/work/order/examine/secondReview",
    method: "post",
    data: data,
  });
}

export function watermarkSaveOrUpdate(data) {
  return request({
    url: "/substance/web/watermark/saveOrUpdateBatch",
    method: "post",
    data: data,
  });
}

export function watermarkCurrent(data) {
  return request({
    url: "/substance/web/watermark/currentList",
    method: "post",
    data: data,
  });
}

export function videoSchedule(id) {
  return request({
    url: "/examine/web/work/order/page/video/schedule/" + id,
    method: "post",
  });
}

export function substanceVideoVideo(id) {
  return request({
    url: "/substance/web/substance-online/video/schedule/" + id,
    method: "post",
  });
}

export function scheduleRetry(id) {
  return request({
    url: "/substance/web/substance-online/video/schedule/retry/" + id,
    method: "post",
  });
}

export function watermarkGlobalQuery() {
  return request({
    url: "/substance/watermarkGlobal/query",
    method: "post",
  });
}

export function watermarkGlobalsaveOrUpdate(data) {
  return request({
    url: "/substance/watermarkGlobal/saveOrUpdate",
    method: "post",
    data: data,
  });
}

export function watermarkGlobalupdateStatus(data) {
  return request({
    url: "/substance/watermarkGlobal/updateStatus",
    method: "post",
    data: data,
  });
}

export function batchUpdateByVideoIds(data) {
  return request({
    url: "substance/web/substance-pre/batchUpdateByVideoIds",
    method: "post",
    data: data,
  });
}

export function updateVideoCardCount(data) {
  return request({
    url: "substance/web/classifyWeb/updateVideoCardCount",
    method: "post",
    data: data,
  });
}

export function substanceOnlineUpdateVideoCardCount(data) {
  return request({
    url: "substance/web/substance-online/updateVideoCardCount",
    method: "post",
    data: data,
  });
}
