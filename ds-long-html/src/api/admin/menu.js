import request from "@/api/axios";

export function getMenu(id) {
  return request({
    url: "/prm/web/menu/getUserMenu",
    data: { parentId: id },
    method: "post",
  });
}

export function fetchMenuTree(data) {
  return request({
    url: "/prm/web/menu/tree/all",
    method: "post",
    data: data,
  });
}
export function RoleTree(data) {
  return request({
    url: "/prm/web/menu/tree",
    method: "post",
    data: data,
  });
}
// export function fetchMenuTree(lazy, parentId) {
//   return request({
//     url: "/prm/web/menu/tree",
//     method: "post",
//     data: { lazy: lazy, parentId: parentId },
//   });
// }

export function addObj(obj) {
  return request({
    url: "/prm/web/menu/save",
    method: "post",
    data: obj,
  });
}

export function getObj(id) {
  return request({
    url: "/prm/web/menu/infoById",
    method: "post",
    data: {
      menuId: id,
    },
  });
}

export function delObj(id) {
  return request({
    url: "/prm/web/menu/del",
    method: "post",
    data: {
      menuId: id,
    },
  });
}

export function putObj(obj) {
  return request({
    url: "/prm/web/menu/update",
    method: "post",
    data: obj,
  });
}
