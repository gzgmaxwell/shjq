import request from "@/api/axios";
// 敏感词下载
export function getAuthorName(data) {
  return request({
    url: "/user/web/ds-user/allUserNickName",
    method: "get",
    params: data,
  });
}
