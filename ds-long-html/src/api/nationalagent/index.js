import request from "@/api/axios";

export function configPage(data) {
  return request({
    url: "/system/web/web-url-config/page",
    method: "post",
    data: data,
  });
}

export function configRm(id) {
  return request({
    url: "/system/web/web-url-config/rm/" + id,
    method: "post",
  });
}

export function configSaveOrUpdate(data) {
  return request({
    url: "/system/web/web-url-config/saveOrUpdate",
    method: "post",
    data: data,
  });
}
