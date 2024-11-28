import request from "@/api/axios";

export function trackingCountAdDayData(data) {
  return request({
    url: "/tracking/web/event/tracking/countAdDayData",
    method: "post",
    data: data,
  });
}

export function advertQueryAdById(data) {
  return request({
    url: "/marketing/web/advert/queryAdById",
    method: "post",
    params: data,
  });
}

export function exchangePoolPage(data) {
  return request({
    url: "/marketing/web/activity/exchangePoolPage",
    method: "get",
    params: data,
  });
}

export function saveExchangeProps(data) {
  return request({
    url: "/marketing/web/activity/saveExchangeProps",
    method: "post",
    data: data,
  });
}

export function editExchangeProps(data) {
  return request({
    url: "/marketing/web/activity/editExchangeProps",
    method: "post",
    data: data,
  });
}

export function rmExchangeProps(id) {
  return request({
    url: "/marketing/web/activity/rmExchangeProps/" + id,
    method: "post",
  });
}

export function schemePage(data) {
  return request({
    url: "/marketing/web/lottery/scheme/page",
    method: "post",
    data: data,
  });
}

export function schemeOperateById(id) {
  return request({
    url: "/marketing/web/lottery/scheme/operateById/" + id,
    method: "get",
  });
}

export function schemeRemoveById(id) {
  return request({
    url: "/marketing/web/lottery/scheme/removeById/" + id,
    method: "get",
  });
}

export function saveLotteryConf(data) {
  return request({
    url: "/marketing/web/lottery/saveLotteryConf",
    method: "post",
    data: data,
  });
}

export function schemeSave(data) {
  return request({
    url: "/marketing/web/lottery/scheme/save",
    method: "post",
    data: data,
  });
}

export function propsSave(data) {
  return request({
    url: "/marketing/web/lottery/props/save",
    method: "post",
    data: data,
  });
}

export function propsList(data) {
  return request({
    url: "/marketing/web/lottery/props/list",
    method: "post",
    data: data,
  });
}

export function getLotteryConf() {
  return request({
    url: "/marketing/web/lottery/getLotteryConf",
    method: "get",
  });
}
/// 1234
export function taskDetails(id) {
  return request({
    url: "/marketing/web/activity/task/details/" + id,
    method: "get",
  });
}

export function taskOperate(id) {
  return request({
    url: "/marketing//web/activity/task/operate/" + id,
    method: "get",
  });
}

export function taskDetailsSave(data) {
  return request({
    url: "/marketing/web/activity/task/details/save",
    method: "post",
    data: data,
  });
}

export function queryTasksList(data) {
  return request({
    url: "/marketing/web/activity/task/queryTasksList",
    method: "post",
    data: data,
  });
}

export function awardConfig(data) {
  return request({
    url: "/marketing/web/award/config",
    method: "post",
    data: data,
  });
}
export function configList(data) {
  return request({
    url: "/marketing/web/award/configList",
    method: "post",
    data: data,
  });
}
export function awardUpdate(data) {
  return request({
    url: "/marketing/web/award/update",
    method: "post",
    data: data,
  });
}
export function autoReceiveSetting(data) {
  return request({
    url: "/system/web/system/autoReceive/setting",
    method: "post",
    data: data,
  });
}

export function awardGetStatus(data) {
  return request({
    url: "/marketing/web/award/getStatus",
    method: "post",
    data: data,
  });
}
export function autoReceiveDetail(data) {
  return request({
    url: "/system/web/system/autoReceive/detail",
    method: "post",
    data: data,
  });
}

export function awardInfo(data) {
  return request({
    url: "/marketing/web/award/info",
    method: "post",
    data: data,
  });
}
// 充值活动下拉数据
export function vipPackage(data) {
  return request({
    url: "/user/web/userVip/vipPackage",
    method: "post",
    data: data,
  });
}
