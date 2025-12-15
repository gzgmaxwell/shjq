//图文管理

import request from "@/api/axios";

export function fetchList1111(data) {
  return request({
    url: "/prm/web/user/page",
    method: "post",
    data,
  });
}

export function pending_pre(data) {
  return request({
    url: "/examine/web/work/order/page/pending/pre",
    method: "post",
    data: data,
  });
}

export function inklore_tenantImport(data) {
  return request({
    url: "/ink-lore/web/inklore/tenantImport",
    method: "post",
    data: data,
  });
}

export function inklore_saveOrUpdate(data) {
  return request({
    url: "/ink-lore/web/inklore/saveOrUpdate",
    method: "post",
    data: data,
  });
}

export function inklore_page(data) {
  return request({
    url: "/ink-lore/web/inklore/page",
    method: "post",
    data: data,
  });
}

export function inklore_contentCenter(data) {
  return request({
    url: "/ink-lore/web/inklore/contentCenter",
    method: "post",
    data: data,
  });
}

export function inklore_available(data) {
  return request({
    url: "/ink-lore/web/inklore/available",
    method: "post",
    data: data,
  });
}

export function inklore_delete(data) {
  return request({
    url: "/ink-lore/web/inklore/delete/" + data,
    method: "get",
  });
}

export function chapterPage(data) {
  return request({
    url: "/ink-lore/web/chapter/page",
    method: "post",
    data: data,
  });
}
export function chapterSaveOrUpdate(data) {
  return request({
    url: "/ink-lore/web/chapter/saveOrUpdate",
    method: "post",
    data: data,
  });
}
export function saveEntire(data) {
  return request({
    url: "/ink-lore/web/chapter/saveEntire",
    method: "post",
    data: data,
  });
}

export function chapter_preview(data) {
  return request({
    url: "/ink-lore/web/chapter/preview",
    method: "post",
    data: data,
  });
}
export function chapterDelete(id) {
  return request({
    url: `/ink-lore/web/chapter/delete/${id}`,
    method: "post",
  });
}
export function auditRecordList(data) {
  return request({
    url: "/ink-lore/web/CommentAuditRecord/auditRecordList",
    method: "post",
    data: data,
  });
}
export function commentAuditList(data) {
  return request({
    url: "/ink-lore/web/CommentAuditRecord/commentAuditList",
    method: "post",
    data: data,
  });
}
export function doAudit(data) {
  return request({
    url: "/ink-lore/web/CommentAuditRecord/doAudit",
    method: "post",
    data: data,
  });
}
export function removeForBatch(data) {
  return request({
    url: "/ink-lore/web/CommentAuditRecord/removeForBatch",
    method: "post",
    data: data,
  });
}

export function modifyAuthorBatch(data) {
  return request({
    url: "/ink-lore/web/inklore/modifyAuthorBatch",
    method: "post",
    data: data,
  });
}

export function availableBatch(data) {
  return request({
    url: "/ink-lore/web/inklore/availableBatch",
    method: "post",
    data: data,
  });
}
export function deleteBatch(data) {
  return request({
    url: "/ink-lore/web/inklore/deleteBatch",
    method: "post",
    data: data,
  });
}
export function chapterDel(data) {
  return request({
    url: "/ink-lore/web/chapter/deleteBatch",
    method: "post",
    data: data,
  });
}
export function inkLoreRecommendList(data) {
  return request({
    url: "/ink-lore/web/inklore/recommend/inkLoreRecommendList",
    method: "post",
    data: data,
  });
}
export function saveInkLoreRecommend(data) {
  return request({
    url: "/ink-lore/web/inklore/recommend/saveInkLoreRecommend",
    method: "post",
    data: data,
  });
}
export function deleteInkLoreRecommend(data) {
  return request({
    url: "/ink-lore/web/inklore/recommend/deleteInkLoreRecommend",
    method: "post",
    data: data,
  });
}
export function userInkLoreList(data) {
  return request({
    url: "/ink-lore/web/inklore/userInkLoreList",
    method: "post",
    data: data,
  });
}

//图文审核

export function userWork(data) {
  //  workContent:[ SUBSTANCE_CONTENT_EXAMINE, INK_LORE_INFO_EXAMINE 图文信息审核, INK_LORE_CONTENT_EXAMINE 图文违规审核 ]
  return request({
    url: "/examine/web/user/work",
    method: "post",
    data: data,
  });
}

export function rollBack(data) {
  return request({
    url: "/examine/web/ink-lore/work/order/roll/back",
    method: "post",
    data: data,
  });
}

export function orderAudit(data) {
  return request({
    url: "/examine/web/ink-lore/work/order/audit",
    method: "post",
    data: data,
  });
}

export function workUser(data) {
  return request({
    url: "/examine/web/user/work/user",
    method: "post",
    data: data,
  });
}

export function orderAssignBatch(data) {
  return request({
    url: "/examine/web/ink-lore/work/order/assignBatch",
    method: "post",
    data: data,
  });
}

// WEB-图文采集数据审核管理
export function inkloreGather_update(data) {
  return request({
    url: "/ink-lore/web/inkloreGather/update",
    method: "post",
    data: data,
  });
}
export function inkloreGather_page(data) {
  return request({
    url: "/ink-lore/web/inkloreGather/page",
    method: "post",
    data: data,
  });
}
export function inkloreGather_modifyAuthorBatch(data) {
  return request({
    url: "/ink-lore/web/inkloreGather/modifyAuthorBatch",
    method: "post",
    data: data,
  });
}
export function inkloreGather_deleteBatch(data) {
  return request({
    url: "/ink-lore/web/inkloreGather/deleteBatch",
    method: "post",
    data: data,
  });
}

// WEB-采集章节数据
export function chapterGather_update(data) {
  return request({
    url: "/ink-lore/web/chapterGather/update",
    method: "post",
    data: data,
  });
}

export function chapterGather_preview(data) {
  return request({
    url: "/ink-lore/web/chapterGather/preview",
    method: "post",
    data: data,
  });
}

export function chapterGather_page(data) {
  return request({
    url: "/ink-lore/web/chapterGather/page",
    method: "post",
    data: data,
  });
}

export function chapterGather_deleteBatch(data) {
  return request({
    url: "/ink-lore/web/chapterGather/deleteBatch",
    method: "post",
    data: data,
  });
}

export function pendingPre(data) {
  return request({
    url: "/examine/web/ink-lore/work/order/page/pending/pre",
    method: "post",
    data: data,
  });
}

export function assign_pre(data) {
  return request({
    url: "/examine/web/ink-lore/work/order/wait/assign/pre",
    method: "post",
    data: data,
  });
}
