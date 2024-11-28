import request from "@/api/axios";
export function accusationClassifyList(data) {
  return request({
    url: "/accusation/web/accusationClassify/list",
    method: "post",
    data,
  });
}
export function accusationList(data) {
  return request({
    url: "/accusation/web/accusation/todoList",
    method: "post",
    data,
  });
}
export function accusationDoHandle(data) {
  return request({
    url: "/accusation/web/accusation/doHandle",
    method: "post",
    data,
  });
}
