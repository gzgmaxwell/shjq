import request from "@/api/axios";

export function fetchList(query) {
  return request({
    url: "/prm/web/user/page",
    method: "post",
    data: query,
  });
}
//租户列表
export function tenantQueryPage(data) {
  return request({
    url: "/prm/web/tenant/queryPage",
    method: "post",
    data: data,
  });
}
export function tenantSave(data) {
  return request({
    url: "/prm/web/tenant/save",
    method: "post",
    data: data,
  });
}
export function tenantEdit(data) {
  return request({
    url: "/prm/web/tenant/edit",
    method: "post",
    data: data,
  });
}
export function tenantDelete(id) {
  return request({
    url: `/prm/web/tenant/delete/${id}`,
    method: "get",
  });
}
export function addObj(obj) {
  return request({
    url: "/prm/web/user/save",
    method: "post",
    data: obj,
  });
}

export function getObj(id) {
  return request({
    url: "/prm/web/user/infoByUserId",
    method: "post",
    data: {
      userId: id,
    },
  });
}

export function delObj(id) {
  return request({
    url: "/prm/web/user/del",
    method: "post",
    data: {
      userId: id,
    },
  });
}

export function putObj(obj) {
  return request({
    url: "/prm/web/user/update",
    method: "post",
    data: obj,
  });
}

export function getDetails(obj) {
  return request({
    url: "/prm/web/user/details/infoByUsername",
    method: "post",
    data: {
      username: obj,
    },
  });
}
//租户用户名唯一性校验
export function userExists(name) {
  return request({
    url: `/prm/web/user/exists/${name}`,
    method: "get",
  });
}
export function removeUser(obj) {
  return request({
    url: "/prm/web/user/del/batch",
    method: "post",
    data: obj,
  });
}

export function ds_user_countryCode(obj) {
  return request({
    url: "/user/web/ds-user/countryCode",
    method: "post",
    data: obj,
  });
}
