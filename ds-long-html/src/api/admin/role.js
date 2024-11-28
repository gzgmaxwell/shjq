import request from "@/api/axios";

export function fetchList(query) {
  return request({
    url: "/prm/web/role/page",
    method: "post",
    data: query,
  });
}
export function roleTree(query) {
  return request({
    url: "/prm/web/role/tree",
    method: "post",
    data: query,
  });
}

export function deptRoleList() {
  return request({
    url: "/prm/web/role/list",
    method: "post",
    data: {},
  });
}

export function roleCodeList() {
  return request({
    url: "/prm/web/role/roleCodeList",
    method: "get",
  });
}

export function getObj(id) {
  return request({
    url: "/prm/web/role/infoById",
    method: "post",
    data: {
      roleId: id,
    },
  });
}

export function addObj(obj) {
  return request({
    url: "/prm/web/role/save",
    method: "post",
    data: obj,
  });
}

export function putObj(obj) {
  return request({
    url: "/prm/web/role/update",
    method: "post",
    data: obj,
  });
}

export function delObj(id) {
  return request({
    url: "/prm/web/role/del",
    method: "post",
    data: {
      roleId: id,
    },
  });
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: "/prm/web/role/menu/update",
    method: "post",
    data: {
      roleId: roleId,
      menuIds: menuIds,
    },
  });
}
//sass套餐新增
export function servicePackageSave(data) {
  return request({
    url: "/prm/web/service-package/save",
    method: "post",
    data: data,
  });
}
//sass套餐修改
export function servicePackageEdit(data) {
  return request({
    url: "/prm/web/service-package/edit",
    method: "post",
    data: data,
  });
}
//sass套餐列表删除
export function servicePackageDelete(id) {
  return request({
    url: `/prm/web/service-package/delete/${id}`,
    method: "get",
  });
}

export function fetchRoleTree(roleName) {
  return request({
    url: "/prm/web/menu/tree/role",
    method: "post",
    data: {
      roleId: roleName,
    },
  });
}
export function removeRole(obj) {
  return request({
    url: "/prm/web/role/del/batch",
    method: "post",
    data: obj,
  });
}
