import request from "../request";

export const orderPage = (data: any) => {
  return request({
    url: "/trade/web/order/page",
    method: "post",
    data: data,
  });
};

// 交易统计 Trade Statistics Controller
export const queryTradeStatistics = () => {
  return request({
    url: "/trade/web/tradeStatistics/queryTradeStatistics",
    method: "get",
  });
};

export function queryTradeAmountTotal(data: any) {
  return request({
    url: "/trade/web/order/queryChannelTradeAmountTotal",
    method: "post",
    data: data,
  });
}

export function bgChannelDataForChannelTagId(data: any) {
  return request({
    url: "/marketing/web/distributor/data/bgChannelDataForChannelTagId",
    method: "post",
    data: data,
  });
}

export function bgChannelDataForDistr(data: any) {
  return request({
    url: "/marketing/web/distributor/data/bgChannelDataForDistr",
    method: "post",
    data: data,
  });
}
//cpa站长看板数据

export function webmasterDashboardNewUser(data: any) {
  return request({
    url: "/marketing/web/distr/statistics/webmasterDashboardNewUser",
    method: "post",
    data: data,
  });
}
//cps站长看板数据
export function webmasterDashboardRecharge(data: any) {
  return request({
    url: "/marketing/web/distr/statistics/webmasterDashboardRecharge",
    method: "post",
    data: data,
  });
}
export function queryWithdrawAmountTotal(data: any) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/queryDistrWithdrawAmountTotal",
    method: "post",
    data: data,
  });
}

export function userLoginCount(data: any) {
  return request({
    url: "/user/web/ds-user/channel/userLoginCount",
    method: "post",
    data: data,
  });
}
export function userAvgLoginCount(data: any) {
  return request({
    url: "/user/web/ds-user/channel/userAvgLoginCount",
    method: "post",
    data: data,
  });
}
export function userTotalCount(data: any) {
  return request({
    url: "/user/web/ds-user/channel/userTotalCount",
    method: "post",
    data: data,
  });
}
export function summaryExport(data: any) {
  return request({
    url: "/marketing/web/summary/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}

export const queryAgentAuditCount = () => {
  return request({
    url: "/trade/web/tradeStatistics/queryAgentAuditCount",
    method: "get",
  });
};

export const clearingSchemeList = (data: any) => {
  return request({
    url: "/marketing/web/clearingScheme/clearingSchemeList",
    method: "post",
    data: data,
  });
};
export const getClearingScheme = (data: any) => {
  return request({
    url: "/marketing/web/clearingScheme/getClearingScheme",
    method: "post",
    data: data,
  });
};

export const saveClearingScheme = (data: any) => {
  return request({
    url: "/marketing/web/clearingScheme/saveClearingScheme",
    method: "post",
    data: data,
  });
};
export const updateClearingScheme = (data: any) => {
  return request({
    url: "/marketing/web/clearingScheme/updateClearingScheme",
    method: "post",
    data: data,
  });
};
export const updateClearingSchemeStatus = (data: any) => {
  return request({
    url: "/marketing/web/clearingScheme/updateClearingSchemeStatus",
    method: "post",
    data: data,
  });
};

export const agentYieldRank = (data: any) => {
  return request({
    url: "/marketing/web/yield/agentYieldRank",
    method: "post",
    data: data,
  });
};
export const distrYieldTrend = () => {
  return request({
    url: "/marketing/web/yield/distrYieldTrend",
    method: "post",
  });
};

// WEB-代理商管理 Extension Agent Web Controller
export const webAgentEdit = (data: any) => {
  return request({
    // url: "/marketing/web/agent/edit",
    url: "/marketing/web/distributor/edit",
    method: "post",
    data: data,
  });
};

export const webAgentExport = (data: any) => {
  return request({
    // url: "/marketing/web/agent/export",
    url: "/marketing/web/distributor/extension/export",
    responseType: "blob", //这里最重要,不要去掉
    method: "post",
    data: data,
  });
};
export const webAgentOperate = (data: any) => {
  return request({
    url: "/marketing/web/distributor/ext/operate/" + data,
    method: "get",
  });
};

export const webAgentQueryAgentPage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/extension/queryPage",
    method: "post",
    data: data,
  });
};

export const distributor_distrPage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/distrPage",
    method: "post",
    data: data,
  });
};

export const webAgentSave = (data: any) => {
  return request({
    url: "/marketing/web/distributor/save",
    method: "post",
    data: data,
  });
};
export const editAgentInfo = (data: any) => {
  return request({
    url: "/marketing/web/distributor/resetPassword",
    method: "post",
    data: data,
  });
};

// 密码加密
export function getKey() {
  return request({
    url: "/auth/app/getKey",
    method: "post",
  });
}

export function currentLevel() {
  return request({
    url: "/marketing/web/distributor/current/level",
    method: "get",
  });
}
export function extInfo() {
  return request({
    url: "/marketing/web/distributor/ext/info",
    method: "get",
  });
}

// WEB-渠道商项目管理 Distributor Package Web Controller
export const packageListByAgentId = (agentId: any) => {
  return request({
    url: "/marketing/web/distributor/package/subPage",
    method: "post",
    data: agentId,
  });
};

export const waitAddList = (id: any) => {
  return request({
    url: "/marketing/web/distributor/package/wait/add/list/" + id,
    method: "get",
  });
};

export const webAgentProjectSave = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/extension/save",
    method: "post",
    data: data,
  });
};

// 推广提现订单 Extension Withdraw Order Controller
export const extensionWithdrawOrderAdd = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/add",
    method: "post",
    data: data,
  });
};
export const distributorExport = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/distributorExport",
    responseType: "blob", //这里最重要,不要去掉
    method: "post",
    data: data,
  });
};
export const distributorList = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/distributorList",
    method: "post",
    data: data,
  });
};

export const myAgentList = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/myAgentList",
    method: "post",
    data: data,
  });
};

export const platformExport = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformExport",
    method: "post",
    data: data,
  });
};

export const platformList = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformList",
    method: "post",
    data: data,
  });
};

export const extensionWithdrawOrderAudit = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/audit",
    method: "post",
    data: data,
  });
};

export const extensionWithdrawOrderHandle = (data: any) => {
  return request({
    url: "/trade/web/extensionWithdrawOrder/handle",
    method: "post",
    data: data,
  });
};

// 渠道商账户 Ext User Acco Controller
export const extUserAccoGetByUserIds = (data: any) => {
  return request({
    url: "/trade/web/extUserAcco/getByUserIds",
    method: "post",
    data: data,
  });
};

// WEB-代理商收益明细 Extension Channel Yield Detail Controller
export const yieldUserList = (data: any) => {
  return request({
    url: "/marketing/web/yield/userList",
    method: "post",
    data: data,
  });
};
export const yieldUserListExport = (data: any) => {
  return request({
    url: "/marketing/web/yield/userListExport",
    responseType: "blob",
    method: "post",
    data: data,
  });
};

export const subExport = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/sub/export",
    responseType: "blob",
    method: "post",
    data: data,
  });
};

export const yieldYieldTotal = (data: any) => {
  return request({
    url: "/marketing/web/yield/yieldTotal",
    method: "post",
    data: data,
  });
};

//WEB-代理商项目管理 Extension Agent Project Web Controller

export const queryProjectPage = (data: any) => {
  return request({
    url: "/marketing/web/agent/project/queryProjectPage",
    method: "post",
    data: data,
  });
};

export const availablePackage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/available/package",
    method: "post",
    data: data,
  });
};
//不可推广安装包
export const unavailablePackage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/unavailable/package",
    method: "post",
    data: data,
  });
};

export const packageSelfPage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/selfPage",
    method: "post",
    data: data,
  });
};

export const agentProjectExport = (data: any) => {
  return request({
    // url: "/marketing/web/agent/project/export",
    url: "/marketing/web/distributor/package/self/export",
    responseType: "blob",
    method: "post",
    data: data,
  });
};

export const projectOperate = (data: any) => {
  return request({
    // url: "/marketing/web/agent/project/operate/" + data,
    url: "/marketing/web/distributor/package/operate/" + data,
    method: "get",
    data: data,
  });
};

// 代理商项目和用户绑定关系-web Extension Agent User Relationship Controller

export const agentUserRelationshipUpdateStatus = (data: any) => {
  return request({
    url: "/marketing/web/agentUserRelationship/updateStatus",
    method: "post",
    data: data,
  });
};

// 代理商项目和用户绑定关系 安装包管理-web Marketing Package Controller

export const packageGenerate = (data: any) => {
  return request({
    url: "/marketing/web/package/generate",
    method: "post",
    data: data,
  });
};

// WEB-代理商收益统计
export function incomeExport(data: any) {
  return request({
    url: "/marketing/web/agent/income/export",
    responseType: "blob",
    method: "post",
    data,
  });
}

export function queryAgentIncomePage(data: any) {
  return request({
    url: "/marketing/web/agent/income/queryAgentIncomePage",
    method: "post",
    data,
  });
}

// 用戶管理

export function getUserDetailInfo(id: any) {
  return request({
    url: "/user/web/ds-user/getUserDetailInfo",
    method: "get",
    params: { id },
  });
}
export function userGoldStatistics(query: any) {
  return request({
    url: "/trade/web/userAccount/userGoldStatistics",
    method: "get",
    params: query,
  });
}

export function userGoldDetails(query: any) {
  return request({
    url: "/trade/web/userAccount/userGoldDetails",
    method: "get",
    params: query,
  });
}
export function userOrderDetails(query: any) {
  return request({
    url: "/trade/web/userAccount/userOrderDetails",
    method: "get",
    params: query,
  });
}

export function getSubstanceDataInfo(data: any) {
  return request({
    url: "/substance/web/substance-online/getSubstanceDataInfo",
    method: "post",
    data,
  });
}

export function classifyList(info: any) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: info,
  });
}

export const messageQueryPage = (data: any) => {
  return request({
    url: "/message/web/ext/message/queryPage",
    method: "post",
    data: data,
  });
};

export function incomeDetailMyCreation(data: any) {
  return request({
    url: "/marketing/web/incomeDetail/myCreation",
    method: "post",
    data,
  });
}

export function incomeDetailMySubCreation(data: any) {
  return request({
    url: "/marketing/web/incomeDetail/mySubCreation",
    method: "post",
    data,
  });
}

export const ext_record_page = (data: any) => {
  return request({
    url: "/marketing/web/distributor/package/ext/record/page",
    method: "post",
    data: data,
  });
};

export function securityupdate_status(data: any) {
  return request({
    url: "/prm/web/authenticatorStatus/updateStatus",
    method: "post",
    data: data,
  });
}

export function getAuthenticatorStatus(data: any) {
  return request({
    url: "/prm/web/authenticatorStatus/getAuthenticatorStatus/" + data,
    method: "get",
  });
}

export function getQrcode(data?: any) {
  return request({
    url: "/prm/web/authenticator/getQrcode",
    method: "get",
    params: data,
    responseType: "arraybuffer",
  });
}

export function getSecret(data?: any) {
  return request({
    url: "/prm/web/authenticator/getSecret",
    method: "get",
    data: data,
  });
}

export function bindGoogleAuthenticatorBySelf(data?: any) {
  return request({
    url: "prm/web/authenticator/bindGoogleAuthenticatorBySelf",
    method: "post",
    data: data,
  });
}

export function bindGoogleAuthenticator(data?: any) {
  return request({
    url: "/prm/web/authenticator/bindGoogleAuthenticator",
    method: "post",
    data: data,
  });
}

export const stationmaster_queryPage = (data: any) => {
  return request({
    url: "/marketing/web/distributor/stationmasterPage",
    method: "post",
    data: data,
  });
};

export const stationmaster_operate = (data: any) => {
  return request({
    url: "/marketing/web/stationmaster/operate/" + data,
    method: "get",
  });
};

export const stationmaster_save = (data: any) => {
  return request({
    url: "/marketing/web/stationmaster/save",
    method: "post",
    data: data,
  });
};
// 获取用户类型
export const distributorUserType = () => {
  return request({
    url: "/marketing/web/distributor/userType",
    method: "post",
  });
};
// 站长数据统计
export const distributorDetail = (data: any) => {
  return request({
    url: "/marketing/web/distributor/detail",
    method: "post",
    data: data,
  });
};
//cpa站长数据统计
export const packageStatisticsNewUser = (data: any) => {
  return request({
    url: "/marketing/web/distr/statistics/packageStatisticsNewUser",
    method: "post",
    data: data,
  });
};
//cps站长数据统计
export const packageStatisticsRecharge = (data: any) => {
  return request({
    url: "/marketing/web/distr/statistics/packageStatisticsRecharge",
    method: "post",
    data: data,
  });
};
export const stationmaster_edit = (data: any) => {
  return request({
    url: "/marketing/web/stationmaster/edit",
    method: "post",
    data: data,
  });
};

export function resetStatus(data: any) {
  return request({
    url: "/prm/web/authenticator/resetStatus",
    method: "post",
    data: data,
  });
}

export function distributorSave(data: any) {
  return request({
    url: "/marketing/web/distributor/save",
    method: "post",
    data: data,
  });
}
export function distributorEdit(data: any) {
  return request({
    url: "/marketing/web/distributor/edit",
    method: "post",
    data: data,
  });
}
//仪表盘
export function channelUerLoginCount(data: any) {
  return request({
    url: "/user/web/ds-user/longOrShort/channel/userLoginCount",
    method: "post",
    data: data,
  });
}
export function channelUserActiveLoginCountV2(data: any) {
  return request({
    url: "/user/web/ds-user/longOrShort/channel/userActiveLoginCountV2",
    method: "post",
    data: data,
  });
}
export function channelUserLoginAndActiveCount(data: any) {
  return request({
    url: "/user/web/ds-user/longOrShort/channel/userLoginAndActiveCount",
    method: "post",
    data: data,
  });
}
export function channelUserAvgLoginCountV3(data: any) {
  return request({
    url: "/user/web/ds-user/longOrShort/channel/userAvgLoginCountV3",
    method: "post",
    data: data,
  });
}
