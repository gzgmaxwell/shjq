// 营销中心/热搜管理
import request from "@/api/axios";

// 分页查询话题列表
export function substanceTopicPage(info) {
  return request({
    url: "/substance/web/substanceTopic/page",
    method: "get",
    params: info,
  });
}
export function editLogPage(info) {
  return request({
    url: "/substance/web/substanceTopic/editLog/page",
    method: "post",
    data: info,
  });
}

// 保存话题
export function substanceTopicSave(info) {
  return request({
    url: "/substance/web/substanceTopic/save",
    method: "post",
    data: info,
  });
}

// 更新话题
export function substanceTopicUpdate(info) {
  return request({
    url: "/substance/web/substanceTopic/update",
    method: "post",
    data: info,
  });
}

// 删除话题
export function substanceTopicDel(info) {
  return request({
    url: "/substance/web/substanceTopic/del/" + info,
    method: "post",
  });
}
