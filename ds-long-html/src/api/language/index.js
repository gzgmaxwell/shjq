import request from "@/api/axios";

export function langPageConfig(data) {
  return request({
    url: "/system/web/system/lang/pageConfig",
    method: "post",
    data,
  });
}
export function langExport(data) {
  return request({
    url: "/system/web/system/lang/export",
    method: "post",
    data,
    responseType: "blob",
  });
}
export function langSaveConfig(data) {
  return request({
    url: "/system/web/system/lang/saveConfig",
    method: "post",
    data,
  });
}
export function langDelete(id) {
  return request({
    url: "/system/web/system/lang/delete/" + id,
    method: "get",
  });
}
export function langImport(data, onProgress) {
  return request({
    url: "/system/web/system/lang/import",
    method: "post",
    data,
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      onProgress(progress);
    },
  });
}
