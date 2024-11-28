//内容管理/视频管理
import request from "@/api/axios";

// 内容管理/视频管理/视频管理表格数据获取
export function videotab(info) {
  return request({
    url: "/substance/web/substance-online/page",
    method: "post",
    data: info,
  });
}

//内容管理/视频管理统计数量
export function countByFailure(info) {
  return request({
    url: "/substance/web/substance-online/countByFailure",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频管理表格项下架
export function downfrom(info) {
  return request({
    url: "/substance/web/substance-online/failure",
    method: "post",
    data: info,
  });
}
//批量上下架
export function failureBatch(info) {
  return request({
    url: "/substance/web/substance-online/failureBatch",
    method: "post",
    data: info,
  });
}
// 批量删除
export function deleteBatch(info) {
  return request({
    url: "/substance/web/substance-online/deleteBatch",
    method: "post",
    data: info,
  });
}

export function freeWatchTimeBatch(info) {
  return request({
    url: "/substance/web/substance-online/freeWatchTimeBatch",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/获取视频列表项表格编辑数据
export function compiletab(info) {
  return request({
    url: "/substance/web/substance-online/getInfoById",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/获取视频标签数据
export function messagetion(info) {
  return request({
    url: "/substance/web/classify/list",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/获取视频标签下拉框数据
export function dropdown(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/获取视频标签下拉数据
export function classificationby(info) {
  return request({
    url: "/substance/web/classify/getClassifyByPre",
    method: "post",
    data: info,
  });
}

//获取全部标签数据
export function listtab(info) {
  return request({
    url: "/substance/web/label/getAllLabelOfWeb",
    method: "post",
    data: info,
  });
}

//获取标签表格数据
export function locating(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/视频基本信息提交
export function fundamental(info) {
  return request({
    url: "/substance/web/substance-online/updateById",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/获取字典信息数据
export function database(info) {
  return request({
    url: "/system/web/system/dictionary/queryList",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/推荐管理/推荐列表穿梭框数据获取
export function shuttle(info) {
  return request({
    url: "/substance/web/recommend/queryRecommendBySubstancId",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/推荐管理/推荐列表穿梭框添加或移除
export function modified(info) {
  return request({
    url: "/substance/web/recommend/batchHandleRecommendDetails",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/推荐管理/热门列表穿梭框获取所有标签
export function popular(info) {
  return request({
    url: "/substance/web/label/list",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/推荐管理/热门列表穿梭框视频热门标签获取
export function possesspop(info) {
  return request({
    url: "/substance/web/label/getHotLabelByPre",
    method: "post",
    data: info,
  });
}

// 内容管理/视频管理/视频信息编辑/推荐管理/添加或移除热门标签
export function brothers(info) {
  return request({
    url: "/substance/web/substance-pre/updatePreHotLabel",
    method: "post",
    data: info,
  });
}

// 互动管理/评论列表数据获取
export function frequency(info) {
  return request({
    url: "/substance/web/comment/commentList",
    method: "post",
    data: info,
  });
}
// 更多评论
export function getCommentDetail(info) {
  return request({
    url: "/substance/web/comment/getCommentDetail",
    method: "post",
    data: info,
  });
}

// 互动管理/评论列表数据删除
export function deletereview(info) {
  return request({
    url: "/substance/web/comment/doRemove",
    method: "post",
    data: info,
  });
}

//批量删除评论
export function removeForBatch(info) {
  return request({
    url: "/substance/web/comment/removeForBatch",
    method: "post",
    data: info,
  });
}
// 互动管理/获取点赞操作记录列表数据
export function somebody(info) {
  return request({
    url: "/substance/web/countOperate/cheatList",
    method: "post",
    data: info,
  });
}

// 互动管理/点赞操作
export function docheat(info) {
  return request({
    url: "/substance/web/countOperate/doCheat",
    method: "post",
    data: info,
  });
}

// 置顶
export function commentTop(info) {
  return request({
    url: "/substance/web/comment/top",
    method: "post",
    data: info,
  });
}
// 取消置顶
export function commentUntop(info) {
  return request({
    url: "/substance/web/comment/untop",
    method: "post",
    data: info,
  });
}
// 排行管理列表获取
export function amonglist(info) {
  return request({
    url: "/substance/web/rank/queryRankBySubstanceId",
    method: "post",
    data: info,
  });
}

// 排行管理/修改排行信息
export function affirm(info) {
  return request({
    url: "/substance/web/rank/modifyVideoFromRank",
    method: "post",
    data: info,
  });
}

// 排行管理/修改排行信息
export function deletelist(info) {
  return request({
    url: "/substance/web/rank/deleteVideoFromRank",
    method: "post",
    data: info,
  });
}

// 互动管理/获取弹幕信息
export function curtain(info) {
  return request({
    url: "/substance/web/bullet/audit/pass/page",
    method: "post",
    data: info,
  });
}

// 互动管理/删除弹幕信息
export function arredelete(info) {
  return request({
    url: "/substance/web/bullet/audit/delete",
    method: "post",
    data: info,
  });
}

export function chapterSave(info) {
  return request({
    url: "/substance/web/substanceOnlineChapter/chapterSave",
    method: "post",
    data: info,
  });
}

export function chapterOnOff(info) {
  return request({
    url: "/substance/web/substanceOnlineChapter/chapterOnOff",
    method: "post",
    data: info,
  });
}

export function chapterDetails(substanceId) {
  return request({
    url: "/substance/web/substanceOnlineChapter/chapterDetails/" + substanceId,
    method: "post",
  });
}
export function getPushAndWatch(info) {
  return request({
    url: "/substance/web/substance-online/getPushAndWatch",
    method: "post",
    data: info,
  });
}
// 用户购买详情
export function getBuyRecord(info) {
  return request({
    url: "/substance/web/substance-online/getBuyRecord",
    method: "post",
    data: info,
  });
}

export function substanceVideoScore(info) {
  return request({
    url: "/substance/web/substance-online/substanceVideoScore",
    method: "post",
    data: info,
  });
}
