import request from "@/api/axios";

export function eventPage(data) {
  return request({
    url: "/tracking/web/event/tracking/eventPage",
    method: "post",
    data,
  });
}

export function deleteProperty(data) {
  return request({
    url: "/tracking/web/event/tracking/deleteProperty",
    method: "post",
    data,
  });
}

export function deleteEvent(data) {
  return request({
    url: "/tracking/web/event/tracking/deleteEvent",
    method: "post",
    data,
  });
}

export function saveOrUpdateEvent(data) {
  return request({
    url: "/tracking/web/event/tracking/saveOrUpdateEvent",
    method: "post",
    data,
  });
}

export function saveOrUpdateProperty(data) {
  return request({
    url: "/tracking/web/event/tracking/saveOrUpdateProperty",
    method: "post",
    data,
  });
}

export function propertyPage(data) {
  return request({
    url: "/tracking/web/event/tracking/propertyPage",
    method: "post",
    data,
  });
}


export function relationList(data) {
  return request({
    url: "/tracking/web/event/tracking/relationList",
    method: "post",
    data,
  });
}

export function propertyList(data) {
  return request({
    url: "/tracking/web/event/tracking/propertyList",
    method: "post",
    data,
  });
}


export function saveOrUpdateRelationBatch(data) {
  return request({
    url: "/tracking/web/event/tracking/saveOrUpdateRelationBatch",
    method: "post",
    data,
  });
}





