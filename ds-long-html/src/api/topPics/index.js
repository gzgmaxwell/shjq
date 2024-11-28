// 所有关于话题的api
import request from "@/api/axios";
// 视频话题
export function getTopPics(info) {
  return request({
    // url: "/substance/web/substanceTopic/page",
    url: "/substance/web/substanceTopic/listByTopicName/" + info,
    method: "get",
    // params: info,
  });
}
