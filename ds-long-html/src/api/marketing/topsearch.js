// 营销中心/热搜管理
import request from "@/api/axios";

// 获取活动列表数据
export function search(info) {
  return request({
    url: "/search/web/hotSearch/statistics",
    method: "post",
    data: info,
  });
}

// 添加榜单列表数据
export function hotSearchSave(info) {
  return request({
    url: "/search/web/hotSearch/save",
    method: "post",
    data: info,
  });
}

// 保存热门话题
export function substanceHotTopicSave(info) {
  return request({
    url: "/substance/web/substanceHotTopic/save",
    method: "post",
    data: info,
  });
}

// 更新/删除/启用 热门话题
export function substanceHotTopicUpdate(info) {
  return request({
    url: "/substance/web/substanceHotTopic/update",
    method: "post",
    data: info,
  });
}

// 分页查询热门话题
export function substanceHotTopicPage(info) {
  return request({
    url: "/substance/web/substanceHotTopic/page",
    method: "get",
    params: info,
  });
}

// 置顶榜单列表数据
export function sticsktop(info) {
  return request({
    url: "/search/web/hotSearch/stick",
    method: "post",
    data: info,
  });
}

// 移除榜单列表数据
export function removedelete(info) {
  return request({
    url: "/search/web/hotSearch/delete",
    method: "post",
    data: info,
  });
}

// 分页查询热搜
export function hotSearchPage(info) {
  return request({
    url: "/search/web/hotSearch/page",
    method: "post",
    data: info,
  });
}
// 更新/删除/是否启用 热搜
export function hotSearchUpdate(info) {
  return request({
    url: "/search/web/hotSearch/update",
    method: "post",
    data: info,
  });
}

// 查询话题下拉列表，支持模糊查询
export function ListByTopicName(info) {
  return request({
    url: "/substance/web/substanceTopic/listByTopicName/" + info,
    method: "get",
  });
}
