import request from "@/api/axios";
// 查询敏感词列表
export function getSensitivList(query) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/list",
    method: "post",
    data: query,
  });
}
// 增加敏感词
export function addSensitiv(query) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/save",
    method: "post",
    data: query,
  });
}
// 编辑敏感词
export function updateSensitiv(query) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/update",
    method: "post",
    data: query,
  });
}
// 删除敏感词
export function delSensitiv(id) {
  return request({
    url: `/checker/web/sensitive/sensitiveWords/delete/${id}`,
    method: "get",
  });
}
// 导入敏感词
export function importSensitiv(query, onProgress) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/import",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data: query,
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      onProgress(progress);
    },
  });
}
// 敏感词下载
export function dowlodSensitiv(data) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/template",
    method: "get",
    params: data,
  });
}
// 敏感词导出
export function sensitiveWordsExport(data) {
  return request({
    url: "/checker/web/sensitive/sensitiveWords/export",
    method: "get",
    params: data,
    responseType: "blob",
  });
}
