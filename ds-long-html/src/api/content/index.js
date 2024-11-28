import request from "@/api/axios";

export function saveVideoGatherChannel(info) {
  return request({
    url: "/gather/web/videoGather/channel/saveVideoGatherChannel",
    method: "post",
    data: info,
  });
}

export function updateVideoGatherChannel(info) {
  return request({
    url: "/gather/web/videoGather/channel/updateVideoGatherChannel",
    method: "post",
    data: info,
  });
}

export function channelList(data) {
  return request({
    url: "/gather/web/videoGather/channel/list",
    method: "post",
    data: data,
  });
}

export function deleteVideoGatherChannel(id) {
  return request({
    url: "/gather/web/videoGather/channel/deleteVideoGatherChannel/" + id,
    method: "get",
  });
}
export function sourceList(id) {
  return request({
    url: "/gather/web/videoGather/channel/source/list/" + id,
    method: "get",
  });
}
export function saveSource(data) {
  return request({
    url: "/gather/web/videoGather/channel/source/saveSource",
    method: "post",
    data: data,
  });
}
export function getAllVideoGatherChannelList(data) {
  return request({
    url: "/gather/web/videoGather/channel/getAllVideoGatherChannelList",
    method: "get",
    params: data,
  });
}

export function recordRecordPage(data) {
  return request({
    url: "/substance/web/dynamic/record/recordPage",
    method: "post",
    data: data,
  });
}
export function recordVideoPage(data) {
  return request({
    url: "/substance/web/dynamic/record/videoPage",
    method: "post",
    data: data,
  });
}

export function saveVideoToDynamic(data) {
  return request({
    url: "/substance/web/dynamic/record/saveVideoToDynamic",
    method: "post",
    data: data,
  });
}

export function deleteVideoFromDynamic(data) {
  return request({
    url: "/substance/web/dynamic/record/deleteVideoFromDynamic",
    method: "post",
    data: data,
  });
}

export function modifyVideoFromDynamic(data) {
  return request({
    url: "/substance/web/dynamic/record/modifyVideoFromDynamic",
    method: "post",
    data: data,
  });
}

export function collectionAdd(data) {
  return request({
    url: "/substance/web/updates/collection/add",
    method: "post",
    data: data,
  });
}

export function collectionDetail(data) {
  return request({
    url: "/substance/web/updates/collection/detail",
    method: "post",
    data: data,
  });
}

export function collectionPage(data) {
  return request({
    url: "/substance/web/updates/collection/page",
    method: "post",
    data: data,
  });
}

export function collectionRemove(data) {
  return request({
    url: "/substance/web/updates/collection/remove",
    method: "post",
    data: data,
  });
}
export function collectionsSaveOrUpdate(data) {
  return request({
    url: "/substance/web/updates/collection/saveOrUpdate",
    method: "post",
    data: data,
  });
}

export function collectionVideoList(data) {
  return request({
    url: "/substance/web/updates/collection/videoList",
    method: "post",
    data: data,
  });
}
//套餐列表
export function queryPage(data) {
  return request({
    url: "/prm/web/service-package/queryPage",
    method: "post",
    data: data,
  });
}

export function getContentCenterPage(data) {
  return request({
    url: "/substance/web/substance-online/getContentCenterPage",
    method: "post",
    data: data,
  });
}


export function toVideoLibrary(data) {
  return request({
    url: "/substance/web/substance-online/toVideoLibrary",
    method: "post",
    data: data,
  });
}

