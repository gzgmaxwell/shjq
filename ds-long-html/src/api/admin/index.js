import request from "@/api/axios";

export function platformListByUser() {
  return request({
    url: "/prm/web/platform/listByUser",
    method: "post",
    data: {},
  });
}

export function tenant_getByUser() {
  return request({
    url: "/prm/web/tenant/getByUser",
    method: "get",
    data: {},
  });
}

export function platformPage(data) {
  return request({
    url: "/prm/web/platform/page",
    method: "post",
    data: data,
  });
}

export function platformSave(data) {
  return request({
    url: "/prm/web/platform/save",
    method: "post",
    data: data,
  });
}

export function switchPlatform(id) {
  return request({
    url: "/prm/web/platform/switchPlatform/" + id,
    method: "get",
  });
}

// 分销系统接口

export function projectPackageList(data) {
  return request({
    url: "/system/web/system/ProjectPackage/projectPackageList",
    method: "post",
    data: data,
  });
}
export function updateProjectPackage(data) {
  return request({
    url: "/system/web/system/ProjectPackage/updateProjectPackage",
    method: "post",
    data: data,
  });
}
export function getVersionByProjectName(data) {
  return request({
    url: "/system/web/system/ProjectPackage/getVersionByProjectName",
    method: "post",
    data: data,
  });
}
export function saveProjectPackage(data) {
  return request({
    url: "/system/web/system/ProjectPackage/saveProjectPackage",
    method: "post",
    data: data,
  });
}
export function clearingSchemeList(data) {
  return request({
    url: "/marketing/web/clearingScheme/clearingSchemeList",
    method: "post",
    data: data,
  });
}
export function clearingAppSchemeDetailList(type) {
  return request({
    url: `/marketing/web/clearingAppScheme/detail/clearingAppSchemeDetailList/${type}`,
    method: "get",
  });
}
export function clearingAppSchemeList(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/clearingAppSchemeList",
    method: "post",
    data: data,
  });
}
export function saveClearingScheme(data) {
  return request({
    url: "/marketing/web/clearingScheme/saveClearingScheme",
    method: "post",
    data: data,
  });
}
//C端方案
export function saveClearingAppScheme(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/saveClearingAppScheme",
    method: "post",
    data: data,
  });
}
export function updateClearingScheme(data) {
  return request({
    url: "/marketing/web/clearingScheme/updateClearingScheme",
    method: "post",
    data: data,
  });
}
export function updateClearingAppScheme(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/updateClearingAppScheme",
    method: "post",
    data: data,
  });
}
export function updateClearingAppSchemeDetail(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/detail/updateClearingAppSchemeDetail",
    method: "post",
    data: data,
  });
}
export function detailUpdateSchemeDetail(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/detail/updateSchemeDetail",
    method: "post",
    data: data,
  });
}

export function updateClearingSchemeStatus(data) {
  return request({
    url: "/marketing/web/clearingScheme/updateClearingSchemeStatus",
    method: "post",
    data: data,
  });
}
export function updateSchemeStatus(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/updateSchemeStatus",
    method: "post",
    data: data,
  });
}
export function deleteClearingSchemes(id) {
  return request({
    url: "/marketing/web/clearingScheme/deleteClearingSchemes/" + id,
    method: "get",
  });
}
export function deleteScheme(data) {
  return request({
    url: "/marketing/web/clearingAppScheme/deleteScheme",
    method: "post",
    data: data,
  });
}
// 获取方案
// export function getClearingScheme(data) {
//   return request({
//     url: "/marketing/web/clearingScheme/getClearingScheme",
//     method: "post",
//     data: data,
//   });
// }

export function getClearingScheme(id) {
  return request({
    url: `/marketing/web/clearingScheme/getClearingScheme/${id}`,
    method: "get",
  });
}
// 修改方案
export function distributorPackageEdit(data) {
  return request({
    url: "/marketing/web/distributor/package/edit",
    method: "post",
    data: data,
  });
}
// 渠道商管理
export function distributorQueryPage(data) {
  return request({
    url: "/marketing/web/distributor/queryPage",
    method: "post",
    data: data,
  });
}
// 渠道商管理列表新接口
export function statisticsPageListAll(data) {
  return request({
    url: "/marketing/web/distr/statistics/pageListAll",
    method: "post",
    data: data,
  });
}
// /web/distributor/treeByDistr
export function treeByDistr(data) {
  return request({
    url: "/marketing/web/distributor/treeByDistr",
    method: "post",
    data: data,
  });
}

export function relationList(data) {
  return request({
    url: "/user/web/ds-user/relation/list",
    method: "post",
    data: data,
  });
}

export function relationListByParentId(data) {
  return request({
    url: "/user/web/ds-user/relation/listByParentId",
    method: "post",
    data: data,
  });
}

export function distributorDataQueryPage(data) {
  return request({
    url: "/marketing/web/distributor/data/queryPage",
    method: "post",
    data: data,
  });
}
export function agentQueryPage(data) {
  return request({
    url: "/marketing/web/distributor/data/agent/queryPage",
    method: "post",
    data: data,
  });
}
export function distributorSave(data) {
  return request({
    url: "/marketing/web/distributor/save",
    method: "post",
    data: data,
  });
}
export function distributorEdit(data) {
  return request({
    url: "/marketing/web/distributor/edit",
    method: "post",
    data: data,
  });
}

export function distributorOperate(id) {
  return request({
    url: `/marketing/web/distributor/operate/${id}`,
    method: "get",
  });
}
export function distributorResetPassword(data) {
  return request({
    url: "/marketing/web/distributor/resetPassword",
    method: "post",
    data: data,
  });
}
export function distributorExport(data) {
  return request({
    url: "/marketing/web/distributor/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}

export function listRatioByDistrId(id) {
  return request({
    url: `/marketing/web/distributor/listRatioByDistrId/${id}`,
    method: "get",
  });
}
// 渠道商项目管理
export function distributorPackageQueryPage(data) {
  return request({
    url: "/marketing/web/distributor/package/queryPage",
    method: "post",
    data: data,
  });
}
export function distributorPackageSave(data) {
  return request({
    url: "/marketing/web/distributor/package/save",
    method: "post",
    data: data,
  });
}

export function distributorPackageListByAgentId(id) {
  return request({
    url: `/system/web/system/ProjectPackage/excludeChannelProjectPackage/${id}`,
    method: "get",
  });
}
export function getAllAppSchemeList() {
  return request({
    url: `/marketing/web/clearingAppScheme/getAllAppSchemeList`,
    method: "get",
  });
}
export function distributorPackageOperate(id) {
  return request({
    url: `/marketing/web/distributor/package/operate/${id}`,
    method: "get",
  });
}
export function distributorPackageExport(data) {
  return request({
    url: "/marketing/web/distributor/package/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 代理详情列表和查看代理统计详情
export function queryProjectPage(data) {
  return request({
    url: "/marketing/web/agent/project/queryProjectPage",
    method: "post",
    data: data,
  });
}

export function projectOperate(id) {
  return request({
    url: `/marketing/web/agent/project/operate/${id}`,
    method: "get",
  });
}
export function projectExport(data) {
  return request({
    url: "/marketing/web/agent/project/export",
    method: "post",
    data: data,
    responseType: "blob",
    // headers: {
    //   "Content-Type": "application/json;charset=utf-8",
    //   Accept: "application/vnd.ms-excel",
    // },
  });
}
// 代理收益
export function queryAgentIncomePage(data) {
  return request({
    url: "/marketing/web/agent/income/queryAgentIncomePage",
    method: "post",
    data: data,
  });
}
export function incomeExport(data) {
  return request({
    url: "/marketing/web/agent/income/export",
    method: "post",
    data: data,
    responseType: "blob",
    // headers: {
    //   "Content-Type": "application/json;charset=utf-8",
    //   Accept: "application/vnd.ms-excel",
    // },
  });
}

// 安装包统计
export function extensionInstallList(data) {
  return request({
    url: "/marketing/web/extensionInstall/list",
    method: "post",
    data: data,
  });
}
export function extensionInstallExport(data) {
  return request({
    url: "/marketing/web/extensionInstall/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
export function extensionInstallBan(data) {
  return request({
    url: "/marketing/web/extensionInstall/ban",
    method: "post",
    data: data,
  });
}
export function extensionInstallEnable(data) {
  return request({
    url: "/marketing/web/extensionInstall/enable",
    method: "post",
    data: data,
  });
}
// 用户列表信息
export function yieldUserList(data) {
  return request({
    url: "/marketing/web/yield/userList",
    method: "post",
    data: data,
  });
}
export function yieldYieldTotal(data) {
  return request({
    url: "/marketing/web/yield/yieldTotal",
    method: "post",
    data: data,
  });
}
export function yieldUserListExport(data) {
  return request({
    url: "/marketing/web/yield/userListExport",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
export function updateStatus(data) {
  return request({
    url: "/marketing/web/agentUserRelationship/updateStatus",
    method: "post",
    data: data,
  });
}
// 渠道收益列表
export function getByUserIds(data) {
  return request({
    url: "/trade/web/extUserAcco/getByUserIds",
    method: "post",
    data: data,
  });
}
// 提现管理
export function platformList(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformList",
    method: "post",
    data: data,
  });
}
export function audit(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/audit",
    method: "post",
    data: data,
  });
}
export function handle(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/handle",
    method: "post",
    data: data,
  });
}
export function platformExportExcel(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformExport",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 裂变提现列表
export function platformCUserList(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformCUserList",
    method: "post",
    data: data,
  });
}
export function platformCUserListExport(data) {
  return request({
    url: "/trade/web/extensionWithdrawOrder/platformCUserListExport",
    method: "post",
    data: data,
    responseType: "blob",
  });
}

// 谷歌身份认证Google Authenticat

export function bindGoogleAuthenticator(data) {
  return request({
    url: "/prm/web/authenticator/bindGoogleAuthenticator",
    method: "post",
    data: data,
  });
}

export function getBingStatus(data) {
  return request({
    url: "/prm/web/authenticator/getBingStatus",
    method: "get",
    data: data,
  });
}

export function getQrcode(data) {
  return request({
    url: "/prm/web/authenticator/getQrcode",
    method: "get",
    params: data,
    responseType: "arraybuffer",
  });
}

export function getSecret(data) {
  return request({
    url: "/prm/web/authenticator/getSecret",
    method: "get",
    data: data,
  });
}

export function resetStatus(data) {
  return request({
    url: "/prm/web/authenticator/resetStatus",
    method: "post",
    data: data,
  });
}

export function getAuthenticatorStatus(data) {
  return request({
    url: "/prm/web/authenticatorStatus/getAuthenticatorStatus/" + data,
    method: "get",
  });
}

export function SecurityupdateStatus(data) {
  return request({
    url: "/prm/web/authenticatorStatus/updateStatus",
    method: "post",
    data: data,
  });
}
export function schedulePage(data) {
  return request({
    url: "/substance/web/substance-pre/schedulePage",
    method: "post",
    data: data,
  });
}

export function uploadSettingGetDetail(data) {
  return request({
    url: "/system/web/video/uploadSetting/getDetail",
    method: "post",
    data: data,
  });
}

export function uploadSettingSaveOrUpdate(data) {
  return request({
    url: "/system/web/video/uploadSetting/saveOrUpdate",
    method: "post",
    data: data,
  });
}
export function classifyDefault() {
  return request({
    url: "/substance/web/classify/default",
    method: "get",
  });
}
// 短信备案
export function platformQueryPage(data) {
  return request({
    url: "/third/web/sms/platform/queryPage",
    method: "post",
    data: data,
  });
}
export function smsPlatformSave(data) {
  return request({
    url: "/third/web/sms/platform/save",
    method: "post",
    data: data,
  });
}
export function smsPlatformEdit(data) {
  return request({
    url: "/third/web/sms/platform/edit",
    method: "post",
    data: data,
  });
}

export function platformOperate(id) {
  return request({
    url: "/third/web/sms/platform/operate/" + id,
    method: "get",
  });
}
export function platformDelete(id) {
  return request({
    url: "/third/web/sms/platform/delete/" + id,
    method: "get",
  });
}
// 短信模版
export function smsQueryPage(data) {
  return request({
    url: "/third/web/sms/template/queryPage",
    method: "post",
    data: data,
  });
}
export function smsTemplateSave(data) {
  return request({
    url: "/third/web/sms/template/save",
    method: "post",
    data: data,
  });
}
export function smsTemplateEdit(data) {
  return request({
    url: "/third/web/sms/template/edit",
    method: "post",
    data: data,
  });
}
// 推荐池列表
export function getReferralPoolsList(data) {
  return request({
    url: "/substance/web/referralPools/getReferralPoolsList",
    method: "post",
    data: data,
  });
}

// 获取推荐级别
export function getReferralLevel(data) {
  return request({
    url: "/substance/web/referralPools/getReferralLevel",
    method: "get",
    params: data,
  });
}
// 获取对应推荐级别的视频
export function getInfoByLevel(level) {
  return request({
    url: "/substance/web/referralPools/getInfoByLevel/" + level,
    method: "get",
  });
}

export function getOnlineList(data) {
  return request({
    url: "/substance/web/referralPools/getOnlineList",
    method: "post",
    data: data,
  });
}
export function saveReferralPools(data) {
  return request({
    url: "/substance/web/referralPools/saveReferralPools",
    method: "post",
    data: data,
  });
}
export function deleteReferralPools(data) {
  return request({
    url: "/substance/web/referralPools/deleteReferralPools",
    method: "post",
    data: data,
  });
}

export function getVideoInfoById(data) {
  return request({
    url: "/substance/web/substance-online/getVideoInfoById",
    method: "post",
    data: data,
  });
}
// 渠道收益
export function incomeDetailPlatform(data) {
  return request({
    url: "/marketing/web/incomeDetail/platform",
    method: "post",
    data: data,
  });
}
export function incomeDetailChannel(data) {
  return request({
    url: "/marketing/web/incomeDetail/channel",
    method: "post",
    data: data,
  });
}
// 收益明细表总计
export function platformTotal() {
  return request({
    url: "/marketing/web/incomeDetail/platformTotal",
    method: "get",
  });
}
// 驳回原因
export function refuseQueryPage(data) {
  return request({
    url: "/examine/web/refuse/queryPage",
    method: "post",
    data: data,
  });
}
// 首页统计
export function userTotalCount(data) {
  return request({
    url: "/user/web/ds-user/userTotalCount",
    method: "post",
    data: data,
  });
}
// 仪表盘 数据统计
export function longOrShortUserLoginCount(data) {
  return request({
    url: "/user/web/ds-user/longOrShort/userLoginCount",
    method: "post",
    data: data,
  });
}

export function userLoginAndActiveCount(data) {
  return request({
    url: "/user/web/ds-user/userLoginAndActiveCount",
    method: "post",
    data: data,
  });
}
//仪表盘 登录活跃统计
export function longOrShortUserLoginAndActiveCount(data) {
  return request({
    url: "/user/web/ds-user/longOrShort/userLoginAndActiveCount",
    method: "post",
    data: data,
  });
}
export function todayUserLoginCount(data) {
  return request({
    url: "/user/web/ds-user/today/userLoginCount",
    method: "post",
    data: data,
  });
}

// export function userLoginCount(data) {
//   return request({
//     url: "/user/web/ds-user/userLoginCount",
//     method: "post",
//     data: data,
//   });
// }
export function userLoginCountV2(data) {
  return request({
    url: "/user/web/ds-user/userLoginCountV2",
    method: "post",
    data: data,
  });
}
//  仪表盘 活跃率
// export function userActiveLoginCount(data) {
//   return request({
//     url: "/user/web/ds-user/longOrShort/userActiveLoginCount",
//     method: "post",
//     data: data,
//   });
// }
export function userActiveLoginCountV2(data) {
  return request({
    url: "/user/web/ds-user/longOrShort/userActiveLoginCountV2",
    method: "post",
    data: data,
  });
}
//仪表盘 留存率
export function userAvgLoginCountV3(data) {
  return request({
    url: "/user/web/ds-user/longOrShort/userAvgLoginCountV3",
    method: "post",
    data: data,
  });
}
// export function todayUserActiveCount(data) {
//   return request({
//     url: "/user/web/ds-user/today/userActiveCount",
//     method: "post",
//     data: data,
//   });
// }
export function userActiveCountV2(data) {
  return request({
    url: "/user/web/ds-user/today/userActiveCountV2",
    method: "post",
    data: data,
  });
}

// export function userAvgLoginCount(data) {
//   return request({
//     url: "/user/web/ds-user/userAvgLoginCount",
//     method: "post",
//     data: data,
//   });
// }
export function userAvgLoginCountV2(data) {
  return request({
    url: "/user/web/ds-user/userAvgLoginCountV2",
    method: "post",
    data: data,
  });
}

// export function userRetentionCount(data) {
//   return request({
//     url: "user/web/ds-user/today/userRetentionCount",
//     method: "post",
//     data: data,
//   });
// }
export function userRetentionCountV2(data) {
  return request({
    url: "/user/web/ds-user/today/userRetentionCountV2",
    method: "post",
    data: data,
  });
}

export function queryTradeAmountTotal(data) {
  return request({
    url: "/trade/web/order/queryTradeAmountTotal",
    method: "post",
    data: data,
  });
}
// 仪表板的基础数据 充值
export function multiTradeAmountTotal(data) {
  return request({
    url: "/trade/web/order/multiTradeAmountTotal",
    method: "post",
    data: data,
  });
}
export function withdrawStatistics(data) {
  return request({
    url: "/trade/web/account/withdraw/withdrawStatistics",
    method: "post",
    data: data,
  });
}
// 仪表盘C端用户提现
export function platformWithdrawStatistics(data) {
  return request({
    url: "/trade/web/account/withdraw/platformWithdrawStatistics",
    method: "post",
    data: data,
  });
}
export function platformGoldExpenditure(data) {
  return request({
    url: "/trade/web/userAccount/platformGoldExpenditure",
    method: "post",
    data: data,
  });
}
// 仪表盘金币消费
export function platformGoldExpenditureMulti(data) {
  return request({
    url: "/trade/web/userAccount/platformGoldExpenditureMulti",
    method: "post",
    data: data,
  });
}
export function summaryExport(data) {
  return request({
    url: "/marketing/web/summary/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 违规审核中分配
export function userAll(data) {
  return request({
    url: "/examine/web/user/all",
    method: "post",
    data: data,
  });
}
// 异议池分配
export function editorAll(data) {
  return request({
    url: "/examine/web/user/editor/all",
    method: "post",
    data: data,
  });
}

// 排行管理/数据管理统计数量
export function videoDataList(data) {
  return request({
    url: "/substance/web/countOperate/videoDataList",
    method: "post",
    data: data,
  });
}
//视频评分全局设置
export function score(data) {
  return request({
    url: "/system/web/video/settings/score",
    method: "post",
    data: data,
  });
}
export function scoreDetail() {
  return request({
    url: "/system/web/video/settings/scoreDetail",
    method: "get",
  });
}
//视频免费时长观看全局设置
export function freeView(data) {
  return request({
    url: "/system/web/video/settings/freeView",
    method: "post",
    data: data,
  });
}
//视频防捕获全局设置
export function recordingSettingsSaveOrUpdate(data) {
  return request({
    url: "/system/web/video/recordingSettings/saveOrUpdate",
    method: "post",
    data: data,
  });
}
// 视频线路优化全局设置
export function getVideoPlayOptimize() {
  return request({
    url: "/system/web/video/settings/getVideoPlayOptimize",
    method: "get",
  });
}
export function updateVideoPlayOptimize(status) {
  return request({
    url: `/system/web/video/settings/updateVideoPlayOptimize/${status}`,
    method: "get",
  });
}
// 超级会员上限设置
export function updateSVIPUpperLimit(data) {
  return request({
    url: "/system/web/video/settings/updateSVIPUpperLimit",
    method: "post",
    data: data,
  });
}
export function recordingSettingsGetDetail(data) {
  return request({
    url: "/system/web/video/recordingSettings/getDetail",
    method: "post",
    data: data,
  });
}
export function freeViewDetail() {
  return request({
    url: "/system/web/video/settings/freeViewDetail",
    method: "get",
  });
}
export function getSVIPUpperLimit() {
  return request({
    url: "/system/web/video/settings/getSVIPUpperLimit",
    method: "get",
  });
}
// 获取无限观看
export function getUnlimitedViewUpperLimit() {
  return request({
    url: "/system/web/video/settings/getUnlimitedViewUpperLimit",
    method: "get",
  });
}
//修改无限观看
export function updateUnlimitedViewUpperLimit(data) {
  return request({
    url: "/system/web/video/settings/updateUnlimitedViewUpperLimit",
    method: "post",
    data: data,
  });
}
// 批量标签
export function onlineClassifyBatchReplace(data) {
  return request({
    url: "/substance/web/classify/onlineClassifyBatchReplace",
    method: "post",
    data: data,
  });
}
// 批量移入异地池
export function dispute(data) {
  return request({
    url: "/substance/web/substance-pre/dispute",
    method: "post",
    data: data,
  });
}
// 日志
export function modifList(data) {
  return request({
    url: "/substance/web/substance-pre/modify/list",
    method: "post",
    data: data,
  });
}
export function operateRecord(data) {
  return request({
    url: "/substance/web/operate-record/page",
    method: "post",
    data: data,
  });
}
// 会员日志
export function modifyPage(data) {
  return request({
    url: "/user/web/vip/good/modify/page",
    method: "post",
    data: data,
  });
}
// 金币日志
export function packageModifyPage(data) {
  return request({
    url: "/trade/web/gold/package/modify/page",
    method: "post",
    data: data,
  });
}

//  test demo
export function userVipDelete(data) {
  return request({
    url: "/user/web/userVip/delete",
    method: "post",
    data: data,
  });
}
export function exchangePoolPage(data) {
  return request({
    url: "/marketing/web/activity/exchangePoolPage",
    method: "get",
    params: data,
  });
}
//  test demo

export function deptUserTree(data) {
  return request({
    url: "/prm/web/dept/user-tree",
    method: "post",
    data: data,
  });
}

export function deptSave(data) {
  return request({
    url: "/prm/web/dept/save",
    method: "post",
    data: data,
  });
}

export function deptUpdate(data) {
  return request({
    url: "/prm/web/dept/update",
    method: "post",
    data: data,
  });
}

export function deptDel(data) {
  return request({
    url: "/prm/web/dept/del",
    method: "post",
    data: { deptId: data.id },
  });
}
// 搜索统计
export function searchHistoryPage(data) {
  return request({
    url: "/search/web/searchHistory/page",
    method: "post",
    data: data,
  });
}
export function getClassifyCountList(data) {
  return request({
    url: "/substance/web/classify/getClassifyCountList",
    method: "post",
    data: data,
  });
}
// 充电博主提现列表
export function withdrawQueryPage(data) {
  return request({
    url: "/trade/web/account/withdraw/queryPage",
    method: "post",
    data: data,
  });
}
export function withdrawAudit(data) {
  return request({
    url: "/trade/web/account/withdraw/audit",
    method: "post",
    data: data,
  });
}
export function withdrawHandle(data) {
  return request({
    url: "/trade/web/account/withdraw/handle",
    method: "post",
    data: data,
  });
}
export function withdrawExport(data) {
  return request({
    url: "/trade/web/account/withdraw/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 充电博主管理
export function applyPage(data) {
  return request({
    url: "/user/web/ds-user/charge/apply/page",
    method: "post",
    data: data,
  });
}
export function applyExamine(data) {
  return request({
    url: "/user/web/ds-user/charge/apply/examine",
    method: "post",
    data: data,
  });
}
export function chargeInfoPage(data) {
  return request({
    url: "/user/web/ds-user/chargeInfo/page",
    method: "post",
    data: data,
  });
}
export function chargeInfoDetail(data) {
  return request({
    url: `/user/web/ds-user/chargeInfo/detail`,
    method: "get",
    params: data,
  });
}
// 充电博主收益管理
export function commissionPage(data) {
  return request({
    url: "/user/web/user/charge/commission/page",
    method: "post",
    data: data,
  });
}
export function commissionAudit(data) {
  return request({
    url: "/user/web/user/charge/commission/audit",
    method: "post",
    data: data,
  });
}
// icon和头像
export function userAvatarPage(data) {
  return request({
    url: "/user/web/user_avatar/page",
    method: "post",
    data: data,
  });
}
export function userAvatarSave(data) {
  return request({
    url: "/user/web/user_avatar/save",
    method: "post",
    data: data,
  });
}
export function userAvatarUpdate(data) {
  return request({
    url: "/user/web/user_avatar/update",
    method: "post",
    data: data,
  });
}
export function userAvatarDelete(data) {
  return request({
    url: "/user/web/user_avatar/delete",
    method: "post",
    data: data,
  });
}
// 黑名单
export function blacklistPage(data) {
  return request({
    url: "/user/web/ds-user/blacklist/page",
    method: "post",
    data: data,
  });
}
export function blacklistRemove(data) {
  return request({
    url: "/user/web/ds-user/blacklist/remove",
    method: "post",
    data: data,
  });
}
export function blacklistAdd(data) {
  return request({
    url: "/user/web/ds-user/blacklist/add",
    method: "post",
    data: data,
  });
}
// 全民代理
export function pageList(data) {
  return request({
    url: "/marketing/web/agent/scheme/pageList",
    method: "post",
    data: data,
  });
}
export function saveScheme(data) {
  return request({
    url: "/marketing/web/agent/scheme/saveScheme",
    method: "post",
    data: data,
  });
}
export function updateScheme(data) {
  return request({
    url: "/marketing/web/agent/scheme/updateScheme",
    method: "post",
    data: data,
  });
}
export function schemeDeleteScheme(id) {
  return request({
    url: `/marketing/web/agent/scheme/deleteScheme/${id}`,
    method: "get",
  });
}
// 全民配置
export function updateSchemeDetail(data) {
  return request({
    url: "/marketing/web/agent/scheme/detail/updateSchemeDetail",
    method: "post",
    data: data,
  });
}
export function getDetailById(id) {
  return request({
    url: `/marketing/web/agent/scheme/detail/getDetailById/${id}`,
    method: "get",
  });
}
// 全民代理日志
export function logPageList(data) {
  return request({
    url: "/marketing/web/agent/scheme/log/pageList",
    method: "post",
    data: data,
  });
}
// 全民代理申请
export function infoPageList(data) {
  return request({
    url: "/marketing/web/agent/user/info/pageList",
    method: "post",
    data: data,
  });
}
export function saveUserAgent(data) {
  return request({
    url: "/marketing/web/agent/user/info/saveUserAgent",
    method: "post",
    data: data,
  });
}
//设置代理申请自动通过
export function updateDictByKey(data) {
  return request({
    url: "/system/web/system/dictionary/updateDictByKey",
    method: "post",
    data: data,
  });
}
//批量修改字典
export function batchUpdateDictByKey(data) {
  return request({
    url: "/system/web/system/dictionary/batchUpdateDictByKey",
    method: "post",
    data: data,
  });
}
// 设置视频插播广告出现几率
export function insertRandomRatioSaveOrUpdate(data) {
  return request({
    url: "/system/web/videoConfigRelative/ad/insertRandomRatio/saveOrUpdate",
    method: "post",
    data: data,
  });
}
export function insertRandomRatioGetRatio(data) {
  return request({
    url: "/system/web/videoConfigRelative/ad/insertRandomRatio/getRatio",
    method: "post",
    data: data,
  });
}
export function userAgentAudit(data) {
  return request({
    url: "/marketing/web/agent/user/info/userAgentAudit",
    method: "post",
    data: data,
  });
}
// 用户详情中代理信息
export function upgradeRecord(data) {
  return request({
    url: "/marketing/web/ext/user/upgrade/record",
    method: "post",
    data: data,
  });
}
// 崩溃日志
export function collapseFileList(data) {
  return request({
    url: "/system/web/system/collapseFile/collapseFileList",
    method: "post",
    data: data,
  });
}
// 其他设置
export function settingGet() {
  return request({
    url: "/system/web/guide/setting/get",
    method: "get",
  });
}
export function settingModify(data) {
  return request({
    url: "/system/web/guide/setting/modify",
    method: "post",
    data: data,
  });
}
// 预警配置
export function extSettingGet(data) {
  return request({
    url: "/system/web/ext/setting/get",
    method: "post",
    data: data,
  });
}
export function deleteIconClassify(data) {
  return request({
    url: "/substance/web/iconClassify/deleteIconClassify",
    method: "post",
    data: data,
  });
}
export function extSettingModify(data) {
  return request({
    url: "/system/web/ext/setting/modify",
    method: "post",
    data: data,
  });
}
export function iconClassifyPageList(data) {
  return request({
    url: "/substance/web/iconClassify/pageList",
    method: "post",
    data: data,
  });
}
// 预警通知
export function messageQueryPage(data) {
  return request({
    url: "/message/web/ext/warning/message/queryPage",
    method: "post",
    data: data,
  });
}
export function messageRemoveById(id) {
  return request({
    url: `/message/web/ext/warning/message/removeById/${id}`,
    method: "get",
  });
}
export function operateById(id) {
  return request({
    url: `/user/web/ds-user/operateById/${id}`,
    method: "get",
  });
}
// 代理层级关系
export function pageForTop(data) {
  return request({
    url: "/marketing/web/agentUserRelationship/pageForTop",
    method: "post",
    data: data,
  });
}
export function iconClassifySaveIconClassify(data) {
  return request({
    url: "/substance/web/iconClassify/saveIconClassify",
    method: "post",
    data: data,
  });
}
// export function listForNextFloor(userId) {
//   return request({
//     url: `/marketing/web/agentUserRelationship/listForNextFloor/${userId}`,
//     method: "post",
//   });
// }
export function listForNextFloor(data) {
  return request({
    url: `/marketing/web/agentUserRelationship/listForNextFloor`,
    method: "post",
    data: data,
  });
}
export function userDeepInfo(userId) {
  return request({
    url: `/marketing/web/agentUserRelationship/userDeepInfo/${userId}`,
    method: "post",
  });
}
// 获取未读消息数量
export function unReadCount(data) {
  return request({
    url: "/message/web/ext/warning/message/unReadCount",
    method: "post",
    data: data,
  });
}

export function iconDetailSaveIconDetail(data) {
  return request({
    url: "/substance/web/iconDetail/saveIconDetail",
    method: "post",
    data: data,
  });
}

export function iconDetailUpdateIconDetail(data) {
  return request({
    url: "/substance/web/iconDetail/updateIconDetail",
    method: "post",
    data: data,
  });
}

export function iconClassifyUpdateIconClassify(data) {
  return request({
    url: "/substance/web/iconClassify/updateIconClassify",
    method: "post",
    data: data,
  });
}
export function updateInviteUser(data) {
  return request({
    url: "/marketing/web/agentUserRelationship/updateInviteUser",
    method: "post",
    data: data,
  });
}
export function ModifyRelationshipRecordPage(data) {
  return request({
    url: "/marketing/web/modifyRelationshipRecord/ModifyRelationshipRecordPage",
    method: "post",
    data: data,
  });
}
export function packageQueryPage(data) {
  return request({
    url: "/marketing/web/distributor/package/queryPage",
    method: "post",
    data: data,
  });
}
// 渠道商数据统计
export function bgChannelDataForDistr(data) {
  return request({
    url: "/marketing/web/distributor/data/bgChannelDataForDistr",
    method: "post",
    data: data,
  });
}
// 安装包数据统计
export function bgChannelDataForChannelTagId(data) {
  return request({
    url: "/marketing/web/distributor/data/bgChannelDataForChannelTagId",
    method: "post",
    data: data,
  });
}
// 站长列表
// export function stationmasterQueryPage(data) {
//   return request({
//     url: "/marketing/web/stationmaster/queryPage",
//     method: "post",
//     data: data,
//   });
// }
export function statisticsPageList(data) {
  return request({
    url: "/marketing/web/distr/statistics/pageList",
    method: "post",
    data: data,
  });
}
export function stationmasterEdit(data) {
  return request({
    url: "/marketing/web/stationmaster/edit",
    method: "post",
    data: data,
  });
}
export function stationmasterOperate(id) {
  return request({
    url: `/marketing/web/stationmaster/operate/${id}`,
    method: "get",
  });
}
export function distrStatisticsDay(data) {
  return request({
    url: "/marketing/web/distr/statistics/distrStatisticsDay",
    method: "post",
    data: data,
  });
}

export function videoCard_getVideoCardList() {
  return request({
    url: "/marketing/web/videoCard/getVideoCardList",
    method: "get",
  });
}

export function videoCard_saveVideoCard(data) {
  return request({
    url: "/marketing/web/videoCard/saveVideoCard",
    method: "post",
    data: data,
  });
}
export function failRecord(data) {
  return request({
    url: "/system/web/system/lines/fail/record",
    method: "post",
    data: data,
  });
}
export function linesPage(data) {
  return request({
    url: "/system/web/system/lines/page",
    method: "post",
    data: data,
  });
}
export function linesSave(data) {
  return request({
    url: "/system/web/system/lines/save",
    method: "post",
    data: data,
  });
}
export function linesDelete(id) {
  return request({
    url: `/system/web/system/lines/delete/${id}`,
    method: "get",
  });
}
export function batchDeletePreVideo(data) {
  return request({
    url: "/substance/web/substance-pre/batchDeletePreVideo",
    method: "post",
    data: data,
  });
}
export function operateFollowCount(data) {
  return request({
    url: "/contacts/app/follow/operateFollowCount",
    method: "post",
    data: data,
  });
}
export function operateFollowCountLogs(data) {
  return request({
    url: "/contacts/app/follow/operateFollowCountLogs",
    method: "post",
    data: data,
  });
}
//审核分配编辑人员
export function videoConvertSettingDetail() {
  return request({
    url: "/system/web/video/settings/videoConvertSettingDetail",
    method: "get",
  });
}

export function videoConvertConfig(data) {
  return request({
    url: "/system/web/video/settings/videoConvert/config",
    method: "post",
    data: data,
  });
}
//系统维护
export function maintainPage(data) {
  return request({
    url: "/system/web/system/maintain/page",
    method: "post",
    data: data,
  });
}
export function maintainDelete(data) {
  return request({
    url: "/system/web/system/maintain/delete",
    method: "post",
    data: data,
  });
}
export function maintainSaveOrUpdate(data) {
  return request({
    url: "/system/web/system/maintain/saveOrUpdate",
    method: "post",
    data: data,
  });
}
// 免费池
export function freePoolPage(data) {
  return request({
    url: "/substance/web/substance-online/freePoolPage",
    method: "post",
    data: data,
  });
}
export function findPageByType(data) {
  return request({
    url: "/substance/web/substance-online/findPageByType",
    method: "post",
    data: data,
  });
}
export function batchAdd(data) {
  return request({
    url: "/substance/web/freePool/batchAdd",
    method: "post",
    data: data,
  });
}
export function batchRemove(data) {
  return request({
    url: "/substance/web/freePool/batchRemove",
    method: "post",
    data: data,
  });
}
export function batchUpdate(data) {
  return request({
    url: "/substance/web/freePool/batchUpdate",
    method: "post",
    data: data,
  });
}

export function package_page(data) {
  return request({
    url: "/marketing/web/saas/package/page",
    method: "post",
    data: data,
  });
}

export function package_record(data) {
  return request({
    url: "/marketing/web/saas/package/record",
    method: "post",
    data: data,
  });
}

export function package_save(data) {
  return request({
    url: "/marketing/web/saas/package/save",
    method: "post",
    data: data,
  });
}
export function package_status(data) {
  return request({
    url: "/marketing/web/saas/package/status",
    method: "post",
    data: data,
  });
}

export function package_list(data) {
  return request({
    url: "/marketing/web/saas/package/status",
    method: "post",
    data: data,
  });
}

export function package_delete(data) {
  return request({
    url: "/marketing/web/saas/package/delete",
    method: "post",
    data: data,
  });
}

export function package_EnableVersion(data) {
  return request({
    url: "/marketing/web/saas/package/EnableVersion",
    method: "post",
    data: data,
  });
}

export function package_regenerate(data) {
  return request({
    url: "/marketing/web/saas/package/regenerate",
    method: "post",
    data: data,
  });
}

export function editConvertSort(data) {
  return request({
    url: "/substance/web/substance-pre/editConvertSort",
    method: "post",
    data: data,
  });
}
export function gotoBuySvipStatistics(data) {
  return request({
    url: "/substance/web/substanceConsume/gotoBuySvipStatistics",
    method: "post",
    data: data,
  });
}
export function gotoBuyVideoStatistics(data) {
  return request({
    url: "/substance/web/substanceConsume/gotoBuyVideoStatistics",
    method: "post",
    data: data,
  });
}
export function buyVideoDetail(data) {
  return request({
    url: "/substance/app/buyVideo/buyVideoDetail",
    method: "post",
    data: data,
  });
}

//权重管理
export function allList(data) {
  return request({
    url: "/substance/web/substanceWatchWeight/allList",
    method: "post",
    data: data,
  });
}
export function saveList(data) {
  return request({
    url: "/substance/web/substanceWatchWeight/saveList",
    method: "post",
    data: data,
  });
}

export function videoCardUseStatistics(data) {
  return request({
    url: "/substance/web/substanceConsume/videoCardUseStatistics",
    method: "post",
    data: data,
  });
}
export function updateBatchPrice(data) {
  return request({
    url: "/substance/web/substance-online/updateBatchPrice",
    method: "post",
    data: data,
  });
}
