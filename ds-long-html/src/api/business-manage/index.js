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

export function userVipListVaild(data) {
  return request({
    url: "/user/web/userVip/listVaild",
    method: "get",
    data: data,
  });
}

export function userVipPage(data) {
  return request({
    url: "/user/web/userVip/page",
    method: "get",
    params: data,
  });
}

export function userVipDelete(data) {
  return request({
    url: "/user/web/userVip/delete",
    method: "post",
    data: data,
  });
}

// 保存
export function userVipSave(data) {
  return request({
    url: "/user/web/userVip/save",
    method: "post",
    data: data,
  });
}

// 更新或删除
export function userVipUpdateOrDel(data) {
  return request({
    url: "/user/web/userVip/updateOrDel",
    method: "post",
    data: data,
  });
}

// 分页查询会员列表
export function userVipVipUserPage(data) {
  return request({
    url: "/user/web/userVip/vipUserPage",
    method: "get",
    params: data,
  });
}

// 金币充值套餐
export function amountExchangeRatePage(data) {
  return request({
    url: "/trade/web/amountExchangeRate/page",
    method: "get",
    params: data,
  });
}
// 新增或编辑或删除
export function amountExchangeRateSaveOrUpdate(data) {
  return request({
    url: "/trade/web/amountExchangeRate/saveOrUpdate",
    method: "post",
    data: data,
  });
}

export function orderPage(data) {
  return request({
    url: "/trade/web/order/page",
    method: "post",
    data: data,
  });
}

export function orderStatistics(data) {
  return request({
    url: "/trade/web/order/orderStatistics",
    method: "post",
    data: data,
  });
}

export function benefitsConfigAddOrUpdate(data) {
  return request({
    url: "/user/web/memberBenefitsConfig/addOrUpdate",
    method: "post",
    data: data,
  });
}

export function memberBenefitsConfigQuery(data) {
  return request({
    url: "/user/web/memberBenefitsConfig/query",
    method: "get",
    data: data,
  });
}
