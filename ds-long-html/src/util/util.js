import * as CryptoJS from "crypto-js";
import i18n from "@/lang/index";
import moment from "moment";

export const videoToBlob = (video) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    video.crossOrigin = "anonymous";
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
};
export const resetSearchData = (searchData) => {
  for (const key in searchData) {
    if (Array.isArray(searchData[key])) {
      searchData[key] = [];
    }
    if (typeof searchData[key] === "string") {
      searchData[key] = "";
    }
    if (typeof searchData[key] === "number") {
      searchData[key] = "";
    }
    if (typeof searchData[key] === "boolean") {
      searchData[key] = "";
    }
  }
};

export const filterNullSearchData = (searchData) => {
  const newSearchData = {
    ...searchData,
  };
  for (const key in newSearchData) {
    if (Array.isArray(newSearchData[key]) && newSearchData[key].length === 0) {
      delete newSearchData[key];
    }
    if (typeof newSearchData[key] === "string" && !newSearchData[key]) {
      delete newSearchData[key];
    }
    if (
      typeof newSearchData[key] === "number" &&
      !newSearchData[key] &&
      newSearchData[key] !== 0
    ) {
      delete newSearchData[key];
    }
    if (newSearchData[key] === null || newSearchData[key] === undefined) {
      delete newSearchData[key];
    }
  }
  return newSearchData;
};

// 处理标签溢出显示函数
// export function tagTooltip(classifyOptions, row) {
//   const classifyIdArr = (row.classifyId && row.classifyId.split(",")) || [];
//   const classifyNameArr = [];
//   classifyOptions.forEach((v) => {
//     if (classifyIdArr.includes(v.id)) {
//       classifyNameArr.push(v.classifyName);
//     }
//   });
//   return classifyNameArr;
// }

export function showTag(opt, arr) {
  const classifyNameArr = [];
  opt.forEach((v) => {
    if (arr.includes(v.id)) {
      if (v.classifyStatus == "0") {
        classifyNameArr.push(`${v.classifyName}(已隐藏)`);
      } else {
        classifyNameArr.push(v.classifyName);
      }
    }
  });
  return classifyNameArr;
}

export const misSecond = (duration = 0) => {
  const mis = 20 / 10020; // 0.0005988023952095808
  const data = duration * mis;
  return data;
};

export const findPath = (tree, targetId, key, children) => {
  let nodePathArray = [];
  const getNodeRoute = (tree, targetId) => {
    for (let index = 0; index < tree.length; index++) {
      if (tree[index][children]) {
        let endRecursiveLoop = getNodeRoute(tree[index][children], targetId);
        if (endRecursiveLoop) {
          nodePathArray.push(tree[index][key]);
          return true;
        }
      }
      if (tree[index][key] === targetId) {
        nodePathArray.push(tree[index][key]);
        return true;
      }
    }
  };
  getNodeRoute(tree, targetId);
  nodePathArray.reverse().join(",");
  return nodePathArray;
};

export const findPathName = (tree, targetId) => {
  let nodePathArray = [];
  const getNodeRoute = (tree, targetId) => {
    for (let index = 0; index < tree.length; index++) {
      if (tree[index].childClassifyList) {
        let endRecursiveLoop = getNodeRoute(
          tree[index].childClassifyList,
          targetId
        );
        if (endRecursiveLoop) {
          nodePathArray.push(tree[index].classifyName);
          return true;
        }
      }
      if (tree[index].id === targetId) {
        nodePathArray.push(tree[index].classifyName);
        return true;
      }
    }
  };
  getNodeRoute(tree, targetId);
  nodePathArray.reverse().join(",");
  return nodePathArray;
};

export const videoLength = (tiemData, optionsTime) => {
  return tiemData?.map((item) => {
    const timeArray = optionsTime.find((v) => v.id === item);
    const [startVideoLength, endVideoLength] =
      timeArray.name.indexOf("~") === -1
        ? [timeArray.name.split(">")[1] * 60000, -1]
        : timeArray.name.split("~").map((time) => time * 60000);
    return { startVideoLength, endVideoLength };
  });
};
export const formatDurationToTime = (result) => {
  let currentTime = moment.duration(result, "seconds");
  const time = moment({
    h: currentTime.hours(),
    m: currentTime.minutes(),
    s: currentTime.seconds(),
  }).format("HH:mm:ss");
  return time;
};
export const i18nTL = (label) => {
  const isTe = i18n.te(`${label}`);
  const str = isTe ? i18n.t(label) : label;
  return str;
};

export const i18nATL = (arr) => {
  let str = "";
  arr.forEach((item) => {
    const isTe = i18n.te(`${item}`);
    if (isTe) {
      str += i18n.t(item);
    } else {
      str += item;
    }
  });
  return str;
};

// 表单序列化
export const serialize = (data) => {
  let list = [];
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
};
export const getObjType = (obj) => {
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  var type = getObjType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};

export const deepCloneNormal = (obj) => {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        objClone[key] = deepClone(obj[key]);
      } else {
        objClone[key] = obj[key];
      }
    }
  }
  return objClone;
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close;
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + " grayMode";
  } else {
    document.body.className = document.body.className.replace(" grayMode", "");
  }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name;
};

/**
 *加密处理
 */
export const encryption = (params) => {
  let { data, type, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach((ele) => {
      var data = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      var iv = key;
      // 加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback();
  }
  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  );
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i];
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};

/**
 * 动态插入css
 */

export const loadStyle = (url) => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const isObjectValueEqual = (a, b) => {
  let result = true;
  Object.keys(a).forEach((ele) => {
    const type = typeof a[ele];
    if (type === "string" && a[ele] !== b[ele]) result = false;
    else if (
      type === "object" &&
      JSON.stringify(a[ele]) !== JSON.stringify(b[ele])
    )
      result = false;
  });
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
};

// 防抖函数
var timer = null; // 创建一个用来存放定时器的变量
export function debounce(fn, ms = 400) {
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
}

let timercb = null;
let isProcessing = false; // 添加一个状态变量
export function debounceCallBack(fn, ms = 400) {
  return function () {
    if (timercb) {
      clearTimeout(timercb);
    }
    if (!isProcessing) {
      // 如果上一次操作已经完成，则执行下一次操作
      timercb = setTimeout(() => {
        isProcessing = true; // 将状态变量设置为正在处理
        fn.apply(this, arguments)
          .then(() => {
            // 在异步操作完成后将状态变量设置为已完成
            isProcessing = false;
          })
          .catch((error) => {
            isProcessing = false;
          });
      }, ms);
    }
  };
}

// 生成查询参数 处理查询参数时才传参
export function createParams(obj) {
  return Object.entries(obj)
    .filter(([key, value]) => value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
// 导出excel流处理
export function downloadExcel(data, fileName) {
  const blob = new Blob([data]);
  const elink = document.createElement("a");
  elink.download = fileName + ".xlsx";
  elink.style.display = "none";
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}

export const getTimeZone = () => {
  const date = new Date().getTimezoneOffset();
  const timezone = -date / 60;
  const str = timezone < 0 ? "-" : "+";
  let newTimezone = "";
  if (Math.abs(timezone) < 10) {
    newTimezone = `${str}0${Math.floor(Math.abs(timezone))}`;
  } else {
    newTimezone = str + Math.floor(Math.abs(timezone));
  }
  const m = Math.abs(date) % 60 > 0 ? Math.abs(date) % 60 : "00";
  return `GMT${newTimezone}:${m}`;
};

//字典枚举
export const enumDictionaryKey = {
  IS_ALLOW_AUTO_CONSUM: "IS_ALLOW_AUTO_CONSUM", //允许用户点击取消自动消耗观影卡
  VIDEO_CARD_DEF_NUM: "VIDEO_CARD_DEF_NUM", //所需观影卡
  ENABLE_DAILY_USAGE_LIMIT: "ENABLE_DAILY_USAGE_LIMIT", //开启每日观影卡使用上限
  DAILY_USAGE_LIMIT: "DAILY_USAGE_LIMIT", //每日观影卡使用上限数量
  ENABLE_DAILY_PREVIEW_LIMIT: "ENABLE_DAILY_PREVIEW_LIMIT", //开启每日视频预览上限
  DAILY_PREVIEW_LIMIT: "DAILY_PREVIEW_LIMIT", //每日视频预览上限数量
  EXTENSION_SHARE_SWITCH: "EXTENSION_SHARE_SWITCH", //推广分享
  POPUP_BIND_INVITE_WINDOW_SWITCH: "POPUP_BIND_INVITE_WINDOW_SWITCH", //首页推广码弹窗开关
  RELEASE_CONTROL: "RELEASE_CONTROL", //发布
  HOME_GUIDE_SETTING: "HOME_GUIDE_SETTING", //身份卡引导页
};

// 待提交→待一审→系统处理中→待二审→二审通过
// 待处理信息→等待处理中→系统处理中→待审核→审核通过
export const enum_status = {
  audit_failure: "10", // 上传失败
  draft: "20", // 草稿
  pending_first_review: "30", // 待一审 ==> 待水印处理
  first_review: "40", // 系统处理中 ==> 水印处理中
  pending_second_review: "50", // 待二审 ==> 待审核
  first_failure: "60", // 一审失败 ==> 作废
  second_failure: "70", // 二审失败 ==> 审核失败
  second_pass: "77", // 二审通过
  audit_fail: "86", // 审核失败
  off: "86", // 下架
  audit_pass: "99", // 审核通过
  reject_by_info: "18", // 信息不合格
  reject_by_watermark: "25", // 水印不合格
  wait_submit: "27", // 待提交 wait_submit
};

export const checkOption = [
  {
    id: enum_status.audit_failure,
    name: "上传失败",
  },
  {
    id: enum_status.draft,
    name: "草稿",
  },
  {
    id: enum_status.pending_first_review,
    name: "待水印处理",
  },
  {
    id: enum_status.first_review,
    name: "水印处理中",
  },
  {
    id: enum_status.pending_second_review,
    name: "待审核",
  },
  {
    id: enum_status.first_failure,
    name: "作废",
  },
  {
    id: enum_status.second_failure,
    name: "审核失败",
  },
  {
    id: enum_status.second_pass,
    name: "二审通过",
  },
  {
    id: enum_status.audit_fail,
    name: "审核失败",
  },
  {
    id: enum_status.off,
    name: "下架",
  },
  {
    id: enum_status.audit_pass,
    name: "审核通过",
  },
  {
    id: enum_status.reject_by_info,
    name: "信息不合规",
  },
  {
    id: enum_status.reject_by_watermark,
    name: "水印不合规",
  },
  {
    id: enum_status.wait_submit,
    name: "待提交",
  },
];

export const ENUM_AuditOpra = {
  reject: "40",
  pass: "99",
};
export const auditOption = [
  {
    id: ENUM_AuditOpra.reject,
    name: "审核驳回",
  },
  {
    id: ENUM_AuditOpra.pass,
    name: "审核通过",
  },
];
export const ENUM_chargingAuditOpra = {
  pass: "PASS",
  reject: "REJECT",
};
export const chargingauditOption = [
  {
    id: ENUM_chargingAuditOpra.pass,
    name: "通过",
    label: "提现成功",
  },
  {
    id: ENUM_chargingAuditOpra.reject,
    name: "驳回",
    label: "提现失败",
  },
];
export const ENUM_bloggerAuditOpra = {
  UNAUDITED: "UNAUDITED",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};
export const bloggerAuditOption = [
  {
    id: ENUM_bloggerAuditOpra.UNAUDITED,
    name: "待审批",
  },
  {
    id: ENUM_bloggerAuditOpra.APPROVE,
    name: "同意",
  },
  {
    id: ENUM_bloggerAuditOpra.REJECT,
    name: "拒绝",
  },
];
export const ENUM_AuditPhase = {
  Watermark: 1,
  violation: 2,
};
export const AuditPhaseStatus = [
  {
    id: ENUM_AuditPhase.Watermark,
    name: "水印处理",
  },
  {
    id: ENUM_AuditPhase.violation,
    name: "违规审核",
  },
];
export const ENUM_COMMENTS_STATUS = {
  pending: "10",
  pass: "30",
  reject: "40",
};

export const commentsStatus = [
  {
    id: ENUM_COMMENTS_STATUS.pending,
    name: "待审核",
  },
  {
    id: ENUM_COMMENTS_STATUS.pass,
    name: "审核通过",
  },
  {
    id: ENUM_COMMENTS_STATUS.reject,
    name: "审核拒绝",
  },
];

export const enum_work_order = {
  VIDEO_CONVERT_PREPARING: "VIDEO_CONVERT_PREPARING", // 视频待處理
  VIDEO_CONVERT_WAITING: "VIDEO_CONVERT_WAITING", //  视频排队中
  VIDEO_CONVERT_ING: "VIDEO_CONVERT_ING", // 视频处理中
  VIDEO_CONVERT_FAIL: "VIDEO_CONVERT_FAIL", //  视频处理失败
  VIDEO_CONVERT_SUCCESS: "VIDEO_CONVERT_SUCCESS", //  视频处理成功
};

export const optWorkOrder = [
  {
    id: enum_work_order.VIDEO_CONVERT_PREPARING,
    name: "待处理",
  },
  {
    id: enum_work_order.VIDEO_CONVERT_WAITING,
    name: "排队中",
  },
  {
    id: enum_work_order.VIDEO_CONVERT_ING,
    name: "处理中",
  },
  {
    id: enum_work_order.VIDEO_CONVERT_FAIL,
    name: "处理失败",
  },
];

export const enum_resolution = {
  VIDEO_CONVERT_WAITING: "VIDEO_CONVERT_WAITING", // 等待中
  VIDEO_CONVERT_ING: "VIDEO_CONVERT_ING", //  处理中
  VIDEO_CONVERT_FAIL: "VIDEO_CONVERT_FAIL", // FAIL
  VIDEO_CONVERT_SUCCESS: "VIDEO_CONVERT_SUCCESS", //  SUCCESS
};

export const menuEnum = {
  // 供应商视频列表
  supplyVideoList: "BK_VIDEO_LIST",

  // C端视频列表
  consumerVideoList: "APP_VIDEO_LIST",

  // 第三方提供的数据
  triateralVideoList: "THIRD_VIDEO_LIST",

  // 水印处理
  waterMarkList: "waterMarkList",

  // 违规审核
  violationCheck: "violationCheck",

  // 内容管理/视频管理
  cmsVideoManage: "CMS_VIDEO_SYSTEM",

  // 内容管理/ 推荐管理
  conRecommend: "conRecommend",

  // 举报与反馈/视频举报
  videoAccusation: "videoAccusation",
  // 推荐池
  referralPpool: "referralPpool",
  // 时间轴ICON 管理
  timelineIcon: "timelineIcon",
  // 内容管理/视频中心
  rentVideoCenter: "rentVideoCenter",
};

export const channelEnum = {
  // 供应商视频上传
  BK: "BK",
  // C端视频列表
  APP: "APP",
  // 第三方提供的数据
  THIRD: "THIRD",
};

// export const enum_refuse_type = {
//   UNQUALIFIED_WATERMARK: "UNQUALIFIED_WATERMARK", // 水印不合格
//   INFORMATION_NOT_COMPLIANT: "INFORMATION_NOT_COMPLIANT", // 信息不合规
//   ILLEGAL: "ILLEGAL", // 违法违禁
//   PORNOGRAPHIC: "PORNOGRAPHIC", // 色情
//   VULGAR: "VULGAR", // 低俗
//   GAMBLING_FRAUD: "GAMBLING_FRAUD", // 赌博诈骗
//   BLOODY_VIOLENCE: "BLOODY_VIOLENCE", // 血腥暴力
//   PERSONAL_ATTACK: "PERSONAL_ATTACK", // 人身攻击
//   BAD_INFORMATION: "BAD_INFORMATION", // 不良信息
// };

export const optionsChannelSource = [
  {
    id: channelEnum.THIRD,
    name: "三方",
  },
  {
    id: channelEnum.BK,
    name: "供应商",
  },
  {
    id: channelEnum.APP,
    name: "用户",
  },
];
export const optionPayType = [
  {
    id: "WECHAT",
    name: "微信",
  },
  {
    id: "ALIPAY",
    name: "支付宝",
  },
  {
    id: "WALLET",
    name: "AppStore",
  },
];

export const ENUM_SHOPORDER = {
  RECHARGE: "RECHARGE",
  BUY_SVIP: "BUY_SVIP",
  CHARGE: "CHARGE",
};
export const optionConsumeType = [
  {
    id: ENUM_SHOPORDER.RECHARGE,
    name: "金币充值",
  },
  {
    id: ENUM_SHOPORDER.BUY_SVIP,
    name: "超级会员",
  },
];

export const optionPayStatus = [
  {
    id: "NOT_PAY",
    name: "待支付",
  },
  {
    id: "PAYING",
    name: "支付中",
  },
  {
    id: "CANCEL",
    name: "已取消",
  },
  {
    id: "FAIL",
    name: "支付失败",
  },
  {
    id: "COMPLETE",
    name: "支付成功",
  },
];

export const ENUM_WMT = {
  delWaterMark: "delWaterMark",
  addWaterMark: "addWaterMark",
};

export const ENUM_DIC_TYPE = {
  recommend_level: "recommend_level", //视频推荐等级
  watch_power: "watch_power", // 视频观看权限
  download_power: "download_power", // 视频下载权限
  sort_level: "sort_level", // 排序等级
  ban_duration: "ban_duration", // 封禁时长
  language_select: "language_select", // 语言选择
  scheme_type: "scheme_type", //方案类型
  package: "package", //项目包类型
  platform_ratio: "platform_ratio", //平台佣金类型
  CountryCode: "CountryCode", //平台佣金类型
};
export const ENUM_AD_COMPLAINTYPE = {
  undercarriage: "UNDERCARRIAGE", //下架
  warn: "WARN", // 警告
  deit: "EDIT", // 编辑
  none: "NONE", // 无违规
  remove: "REMOVE", // 删除
  ban: "BAN", // 封禁
};

export const ENUM_USER_STATUS = {
  enable: "ENABLE",
  disable: "DISABLE",
  logoff: "LOGOFF",
  delete: "DELETE",
};
export const userAccountStatus = [
  {
    id: ENUM_USER_STATUS.enable,
    name: "正常",
  },
  {
    id: ENUM_USER_STATUS.disable,
    name: "禁用",
  },
  {
    id: ENUM_USER_STATUS.logoff,
    name: "已注销",
  },
];
export const AuthorStatus = [
  {
    id: ENUM_USER_STATUS.enable,
    name: "启用",
  },
  {
    id: ENUM_USER_STATUS.delete,
    name: "已删除",
  },
  {
    id: ENUM_USER_STATUS.disable,
    name: "已禁用",
  },
  {
    id: ENUM_USER_STATUS.logoff,
    name: "已注销",
  },
];
export const ENUM_USER_SOURCE = {
  appUser: "1",
  webUser: "2",
};
export const userRegistSource = [
  {
    id: ENUM_USER_SOURCE.appUser,
    name: "app注册",
  },
  {
    id: ENUM_USER_SOURCE.webUser,
    name: "web端创建",
  },
];
export const ENUM_USER_VIPINFO = {
  allVip: "",
  no: "NO",
  vip: "VIP",
  svip: "SVIP",
};
export const userVipInfo = [
  {
    id: ENUM_USER_VIPINFO.allVip,
    name: "全部用户信息",
  },
  {
    id: ENUM_USER_VIPINFO.no,
    name: "非正式会员",
  },
  {
    id: ENUM_USER_VIPINFO.vip,
    name: "正式会员",
  },
  {
    id: ENUM_USER_VIPINFO.svip,
    name: "超级会员",
  },
];
export const ENUM_VIP_ACTIVE_STATUS = {
  normal: "NORMAL",
  invaild: "INVAILD",
  none: "NONE",
  NOT_START: "NOT_START",
};
export const optionsVipActive = [
  {
    id: ENUM_VIP_ACTIVE_STATUS.normal,
    name: "活动正常",
  },
  {
    id: ENUM_VIP_ACTIVE_STATUS.invaild,
    name: "活动过期",
  },
  {
    id: ENUM_VIP_ACTIVE_STATUS.none,
    name: "无活动",
  },
  {
    id: ENUM_VIP_ACTIVE_STATUS.NOT_START,
    name: "未开始",
  },
];
export const ENUM_USER_GENDER = {
  male: "MALE",
  female: "FEMALE",
  secrecy: "SECRECY",
};
export const userGender = [
  {
    id: ENUM_USER_GENDER.male,
    name: "男",
  },
  {
    id: ENUM_USER_GENDER.female,
    name: "女",
  },
  {
    id: ENUM_USER_GENDER.secrecy,
    name: "保密",
  },
];
export const ENUM_WATCH_PERMISSION = {
  free: "free",
  vip: "vip",
  svip: "svip",
  charge: "charge",
};
export const optionWatchPermission = [
  {
    id: ENUM_WATCH_PERMISSION.free,
    name: "免费",
    label: "普通用户可看",
  },
  // {
  //   id: ENUM_WATCH_PERMISSION.vip,
  //   name: "VIP",
  // },
  {
    id: ENUM_WATCH_PERMISSION.svip,
    name: "超级会员",
    label: "超级会员可看",
  },
  // {
  //   id: ENUM_WATCH_PERMISSION.charge,
  //   name: "收费",
  // },
];
export const enum_paidVideo = {
  yes: true,
  no: false,
};
export const optPaidVideo = [
  {
    id: enum_paidVideo.yes,
    name: "是",
  },
  {
    id: enum_paidVideo.no,
    name: "否",
  },
];

export const ENUM_VIDEO_STATUS = {
  all: "",
  normal: false,
  delist: true,
};
export const videoUnmountStatus = [
  {
    id: ENUM_VIDEO_STATUS.all,
    name: "全部",
  },
  {
    id: ENUM_VIDEO_STATUS.normal,
    name: "上架",
  },
  {
    id: ENUM_VIDEO_STATUS.delist,
    name: "下架",
  },
];
export const ENUM_AD_HANDLETYPE = {
  processed: "2",
  unprocessed: "1",
};
export const optionADHandletype = [
  {
    id: ENUM_AD_HANDLETYPE.processed,
    name: "已处理",
  },
  {
    id: ENUM_AD_HANDLETYPE.unprocessed,
    name: "未处理",
  },
];
export const ENUM_VIDEO_VIOLATION = {
  no: 0,
  yes: 1,
};
export const videoViolation = [
  {
    id: ENUM_VIDEO_VIOLATION.no,
    name: "否",
  },
  {
    id: ENUM_VIDEO_VIOLATION.yes,
    name: "是",
  },
];
export const ENUM_VERSIONUPDATE_STATUS = {
  no: "NO",
  yes: "YES",
};
export const optionsVersionUpdate = [
  {
    id: ENUM_VERSIONUPDATE_STATUS.no,
    name: "否",
  },
  {
    id: ENUM_VERSIONUPDATE_STATUS.yes,
    name: "是",
  },
];
export const ENUM_ACTIVE_STATUS = {
  ongoing: "ONGOING",
  tostart: "TOSTART",
  over: "OVER",
};
export const activitiesStatus = [
  {
    id: ENUM_ACTIVE_STATUS.ongoing,
    name: "进行中",
  },
  {
    id: ENUM_ACTIVE_STATUS.tostart,
    name: "待开始",
  },
  {
    id: ENUM_ACTIVE_STATUS.over,
    name: "已结束",
  },
];
export const ENUM_TRIA_STATUS = {
  close: "close",
  open: "open",
};

export const optionTriaStatus = [
  {
    id: ENUM_TRIA_STATUS.open,
    name: "打开",
  },
  {
    id: ENUM_TRIA_STATUS.close,
    name: "关闭",
  },
];
export const EnumWithdrawStatus = {
  pending: "PENDING",
  withdrawing: "WITHDRAWING",
  succeed: "SUCCEED",
  failed: "FAILED",
  reject: "REJECT",
};

export const optionWithdrawStatus = [
  {
    id: EnumWithdrawStatus.pending,
    name: "待审核",
  },
  {
    id: EnumWithdrawStatus.withdrawing,
    name: "提现中",
  },
  {
    id: EnumWithdrawStatus.succeed,
    name: "提现成功",
  },
  {
    id: EnumWithdrawStatus.failed,
    name: "提现失败",
  },
  {
    id: EnumWithdrawStatus.reject,
    name: "驳回",
  },
];

export const EnumPayTypeWay = {
  wxpay: "wxpay",
  alipay: "alipay",
  bankPay: "bankPay",
};
export const optionPayTypeWay = [
  {
    id: EnumPayTypeWay.wxpay,
    name: "微信",
    label: "微信账号",
  },
  {
    id: EnumPayTypeWay.alipay,
    name: "支付宝",
    label: "支付宝账号",
  },
  {
    id: EnumPayTypeWay.bankPay,
    name: "银联支付",
    label: "银联支付",
  },
];
export const EnumchargingPayTypeWay = {
  ALIPAY: "ALIPAY",
  WECHAT_PAY: "WECHAT_PAY",
  BANK_PAY: "BANK_PAY",
};
export const optionchargingPayTypeWay = [
  {
    id: EnumchargingPayTypeWay.ALIPAY,
    name: "支付宝",
  },
  {
    id: EnumchargingPayTypeWay.WECHAT_PAY,
    name: "微信",
  },
  {
    id: EnumchargingPayTypeWay.BANK_PAY,
    name: "银联支付",
  },
];

export const EnumSettlementMethod = {
  day: "DAY",
  month: "MONTH",
  week: "WEEK",
};
export const optionSettlementMethod = [
  {
    id: EnumSettlementMethod.day,
    name: "日结",
  },
  {
    id: EnumSettlementMethod.month,
    name: "月结",
  },
  {
    id: EnumSettlementMethod.week,
    name: "周结",
  },
];
export const EnumChannelStatus = {
  normal: "NORMAL",
  disabled: "DISABLED",
};
export const optionChannelStatus = [
  {
    id: EnumChannelStatus.normal,
    name: "正常",
    label: "启用",
  },
  {
    id: EnumChannelStatus.disabled,
    name: "禁用",
    label: "禁用",
  },
];

export const EnumBuyLimit = {
  limit: 1,
  noLimit: 0,
};
export const optionBuyLimit = [
  {
    id: EnumBuyLimit.limit,
    name: "限制",
  },
  {
    id: EnumBuyLimit.noLimit,
    name: "不限制",
  },
];

export const EnumSubscribe = {
  year: "1",
  mouth: "2",
  noSubscribe: "0",
};
export const optionSubscribe = [
  {
    id: EnumSubscribe.year,
    name: "按年",
  },
  {
    id: EnumSubscribe.mouth,
    name: "按月",
  },
  {
    id: EnumSubscribe.noSubscribe,
    name: "无订阅",
  },
];

export const EnumLang = {
  zhCn: "zh-cn",
  zhTw: "zh-tw",
  en: "en",
};
export const optionlanguage = [
  { code: EnumLang.zhCn, name: "中文语言" },
  { code: EnumLang.zhTw, name: "繁体语言" },
  { code: EnumLang.en, name: "English" },
];
export const EnumAdType = {
  BANNER: "BANNER", // banner
  VIDEO_FLOW: "VIDEO_FLOW", // 信息流
  POP_UPS: "POP_UPS", // 弹窗
  FLOATING_WINDOW: "FLOATING_WINDOW", // 浮窗
  BOTTOM_BANNER: "BOTTOM_BANNER", // 底部横视频
  APP_LAUNCH_PAGE: "APP_LAUNCH_PAGE", // APP启动页,
  VIDEO_DETAIL_PAGE: "VIDEO_DETAIL_PAGE", // advertLocationName : "视频详情-为你推荐"
  EVENT_PAGE_VIDEO: "EVENT_PAGE_VIDEO", // advertLocationName : "动态列表-视频"
  EVENT_PAGE_COLLECT: "EVENT_PAGE_COLLECT", // advertLocationName : "动态列表-合集"
  MY_HOME_PAGE: "MY_HOME_PAGE", // 个人中心
  WALLET_PAGE: "WALLET_PAGE", //  钱包
  EVENT_PAGE: "EVENT_PAGE", //  动态列表
  TALK_PAGE: "TALK_PAGE", // 话题详情
  VIDEO_DETAIL_FLOATING_WINDOW: "VIDEO_DETAIL_FLOATING_WINDOW", // 视频详情-底角浮窗
  INDEX_PAGE_POP_UPS: "INDEX_PAGE_POP_UPS", // 首页弹窗
  VIDEO_DETAIL_AUTHOR_DESC: "VIDEO_DETAIL_AUTHOR_DESC", //  作者简介
  PORTRAIT_BOTTOM_BANNER: "PORTRAIT_BOTTOM_BANNER", // 底部横视频
  FIRST_PAGE: "FIRST_PAGE", // 一级页面广告位
  VIDEO_INSERT_AD: "VIDEO_INSERT_AD", // 插播广告
  VIDEO_STOP_AD: "VIDEO_STOP_AD", // 暂停广告
  BULLET_AD: "BULLET_AD", // 弹幕广告
  SHORT_VIDEO_FLOW: "SHORT_VIDEO_AD", // 短视频播放器信息流
};

export const optionAdType = [
  {
    id: EnumAdType.BANNER,
    name: "banner",
  },
  {
    id: EnumAdType.VIDEO_FLOW,
    name: "信息流",
  },
  {
    id: EnumAdType.POP_UPS,
    name: "弹窗",
  },
  {
    id: EnumAdType.FLOATING_WINDOW,
    name: "浮窗",
  },
  {
    id: EnumAdType.BOTTOM_BANNER,
    name: "底部横幅",
  },
];

export const Enum_AD_SCREEN = {
  full_screen: "FULL_SCREEN",
  half_screen: "HALF_SCREEN",
};
export const optionAdScreen = [
  {
    id: Enum_AD_SCREEN.full_screen,
    name: "全屏",
  },
  {
    id: Enum_AD_SCREEN.half_screen,
    name: "半屏",
  },
];
export const EnumAdvertFormat = {
  VIDEO: "VIDEO",
  PICTURE: "PICTURE",
};

export const EnumAdvertImageSize = {
  SIZE_3_4: "SIZE_3_4",
  SIZE_16_9: "SIZE_16_9",
};
export const optionAdvertFormat = [
  {
    id: EnumAdvertFormat.VIDEO,
    name: "视频",
  },
  {
    id: EnumAdvertFormat.PICTURE,
    name: "图片",
  },
];

export const optAdvertImageSize = [
  {
    id: EnumAdvertImageSize.SIZE_16_9,
    name: "16:9",
    width: 16,
    height: 9,
  },
  {
    id: EnumAdvertImageSize.SIZE_3_4,
    name: "3:4",
    width: 3,
    height: 4,
  },
];

export const EnumComStatus = {
  ON: "ON",
  OFF: "OFF",
};
export const optionComStatus = [
  {
    id: EnumComStatus.ON,
    name: "启用",
  },
  {
    id: EnumComStatus.OFF,
    name: "停用",
  },
];

export const EnumStatus = {
  ON: 1,
  OFF: 0,
};
export const optionStatus = [
  {
    id: EnumStatus.ON,
    name: "启用",
    label: "显示",
  },
  {
    id: EnumStatus.OFF,
    name: "停用",
    label: "隐藏",
  },
];

export const EnumTaskStatus = {
  ENABLE: "ENABLE",
  DISABLED: "DISABLED",
};
export const optTaskStatus = [
  {
    id: EnumTaskStatus.ENABLE,
    name: "启用",
  },
  {
    id: EnumTaskStatus.DISABLED,
    name: "停用",
  },
];
export const EnumSecurityCenterStatus = {
  ON: 0,
  OFF: 1,
};
export const optionSecurityCenterStatus = [
  {
    id: EnumSecurityCenterStatus.ON,
    name: "启用",
  },
  {
    id: EnumSecurityCenterStatus.OFF,
    name: "禁用",
  },
];

export const optionUpDownStatus = [
  {
    id: EnumComStatus.ON,
    name: "否",
  },
  {
    id: EnumComStatus.OFF,
    name: "是",
  },
];

export const EnumJumpType = {
  LINK: "LINK",
  ROUTER: "ROUTER",
  GAME: "GAME",
  VIDEO: "VIDEO",
  VIP: "VIP",
  GOLD: "GOLD",
  NATIONAL_AGENT: "NATIONAL_AGENT",
  BIND_MOBILE_WELFARE: "BIND_MOBILE_WELFARE",
};
export const optionJumpType = [
  {
    id: EnumJumpType.LINK,
    name: "外链",
  },
  {
    id: EnumJumpType.ROUTER,
    name: "内链",
  },
];

export const optJumpType = [
  {
    id: EnumJumpType.LINK,
    name: "外链",
  },
  {
    id: EnumJumpType.ROUTER,
    name: "内链",
  },
  {
    id: EnumJumpType.GAME,
    name: "游戏",
  },
  {
    id: EnumJumpType.VIDEO,
    name: "视频",
  },
  {
    id: EnumJumpType.VIP,
    name: "会员充值",
  },
  {
    id: EnumJumpType.GOLD,
    name: "金币充值",
  },
  {
    id: EnumJumpType.NATIONAL_AGENT,
    name: "全民代理",
  },
  {
    id: EnumJumpType.BIND_MOBILE_WELFARE,
    name: "绑定手机",
  },
];
export const EnumCrowdType = {
  ALL: "ALL",
  BIND_MOBILE_USER: "BIND_MOBILE_USER",
  NOT_BIND_MOBILE_USER: "NOT_BIND_MOBILE_USER",
  VIP_USER: "VIP_USER",
  NORMAL_USER: "NORMAL_USER",
};
export const optCrowdType = [
  {
    id: EnumCrowdType.ALL,
    name: "全部用户",
  },
  {
    id: EnumCrowdType.BIND_MOBILE_USER,
    name: "已绑定手机号",
  },
  {
    id: EnumCrowdType.NOT_BIND_MOBILE_USER,
    name: "未绑定手机号",
  },
  {
    id: EnumCrowdType.VIP_USER,
    name: "超级会员",
  },
  {
    id: EnumCrowdType.NORMAL_USER,
    name: "非超级会员",
  },
];
export const EnumLocationType = {
  NAVIGATION: "NAVIGATION",
  RECOMMEND: "RECOMMEND",
  RANK: "RANK",
  FIXED: "FIXED",
};
export const optionLocationType = [
  {
    id: EnumLocationType.NAVIGATION,
    name: "标签",
  },
  {
    id: EnumLocationType.RECOMMEND,
    name: "推荐",
  },
  {
    id: EnumLocationType.RANK,
    name: "排行",
  },
  {
    id: EnumLocationType.FIXED,
    name: "其他",
  },
];

export const EnumScreenDirection = {
  ver: 0,
  hoz: 1,
};
export const optionsScreenDirection = [
  {
    id: EnumScreenDirection.ver,
    name: "竖屏",
  },
  {
    id: EnumScreenDirection.hoz,
    name: "横屏",
  },
];

export const EnumClassifyType = {
  report: "1",
  forbidden: "2",
};
export const optionsClassifyType = [
  {
    id: EnumClassifyType.report,
    name: "举报分类",
  },
  {
    id: EnumClassifyType.forbidden,
    name: "封禁分类",
  },
];
export const EnumNavigationType = {
  hot: "HOT",
  recommend: "RECOMMEND",
  classify: "CLASSIFY",
  rank: "RANK",
};
export const optionsNavigationType = [
  {
    id: EnumNavigationType.hot,
    name: "热门",
  },
  {
    id: EnumNavigationType.recommend,
    name: "推荐",
  },
  {
    id: EnumNavigationType.classify,
    name: "分类",
  },
  {
    id: EnumNavigationType.rank,
    name: "排行",
  },
];
export const EnumNavigationLevel = {
  firstLevel: 1,
  twoLevel: 2,
};
export const optionsNavigationLevel = [
  {
    id: EnumNavigationLevel.firstLevel,
    name: "一级",
  },
  {
    id: EnumNavigationLevel.twoLevel,
    name: "二级",
  },
];

export const optCerStatus = [
  {
    id: "1",
    name: "已完成",
  },
  {
    id: "2",
    name: "未完成",
  },
];
export const EnumUserCreateType = {
  userCreate: 1,
  systemCreate: 0,
  allType: "",
};
export const optionsUserCreateType = [
  {
    id: EnumUserCreateType.allType,
    name: "全部创建类型",
  },
  {
    id: EnumUserCreateType.userCreate,
    name: "用户创建",
  },
  {
    id: EnumUserCreateType.systemCreate,
    name: "后台创建",
  },
];

export const EnumAuthenticator = {
  bind: true,
  noneBind: false,
};
export const optionsAuthenticator = [
  {
    id: EnumAuthenticator.bind,
    name: "绑定",
  },
  {
    id: EnumAuthenticator.noneBind,
    name: "未绑定",
  },
];
export const EnumSmsStatus = {
  platformOpen: true,
  platformClose: false,
};
export const optionsSmsStatus = [
  {
    id: EnumSmsStatus.platformOpen,
    name: "开启",
  },
  {
    id: EnumSmsStatus.platformClose,
    name: "关闭",
  },
];

export const EnumROLETYPE = {
  admin: "ADMIN",
  manager: "MANAGER",
  staff: "STAFF",
  spread: "SPREAD",
  agent: "AGENT",
  videoEditor: "VIDEO_EDITOR",
  CPA_STATIONMASTER: "CPA_STATIONMASTER",
  CPS_STATIONMASTER: "CPS_STATIONMASTER",
  CPT_STATIONMASTER: "CPT_STATIONMASTER",
};
export const optionsRoleType = [
  {
    id: EnumROLETYPE.admin,
    name: "管理员",
  },
  {
    id: EnumROLETYPE.manager,
    name: "主管",
  },
  {
    id: EnumROLETYPE.staff,
    name: "员工",
  },
  {
    id: EnumROLETYPE.spread,
    name: "渠道商",
  },
  {
    id: EnumROLETYPE.agent,
    name: "代理商",
  },
  {
    id: EnumROLETYPE.videoEditor,
    name: "编辑员",
  },
  {
    id: EnumROLETYPE.CPA_STATIONMASTER,
    name: "cpa站长",
  },
  {
    id: EnumROLETYPE.CPS_STATIONMASTER,
    name: "cps站长",
  },
  {
    id: EnumROLETYPE.CPT_STATIONMASTER,
    name: "cpt站长",
  },
];

export const EnumChannelType = {
  PLATFORM: "PLATFORM",
  CHANNEL: "CHANNEL",
};
export const optionChanneType = [
  {
    id: EnumChannelType.PLATFORM,
    name: "官方渠道商",
  },
  {
    id: EnumChannelType.CHANNEL,
    name: "特约渠道商",
  },
];
export const EnumDataType = {
  SELF: "SELF",
  ALL: "ALL",
};
export const optionDataType = [
  {
    id: EnumDataType.SELF,
    name: "仅查看自己",
  },
  {
    id: EnumDataType.ALL,
    name: "ALL",
  },
];
export const EnumTIMETYPE = {
  timeOne: "timeOne",
  timeTwo: "timeTwo",
  timeThree: "timeThree",
  timeFour: "timeFour",
  timeFive: "timeFive",
  timeSix: "timeSix",
  timeSeven: "timeSeven",
};
export const optionsTimeType = [
  {
    id: EnumTIMETYPE.timeOne,
    name: "0~5",
  },
  {
    id: EnumTIMETYPE.timeTwo,
    name: "5~10",
  },
  {
    id: EnumTIMETYPE.timeThree,
    name: "10~15",
  },
  {
    id: EnumTIMETYPE.timeFour,
    name: "15~30",
  },
  {
    id: EnumTIMETYPE.timeFive,
    name: "30~60",
  },
  {
    id: EnumTIMETYPE.timeSix,
    name: "60~120",
  },
  {
    id: EnumTIMETYPE.timeSeven,
    name: ">120",
  },
];
export const EnumMODULETYPE = {
  default: "DEFAULT",
  recommend: "RECOMMEND",
  more: "MORE",
};
export const optionsModuleType = [
  {
    id: EnumMODULETYPE.default,
    name: "默认服务",
  },
  {
    id: EnumMODULETYPE.recommend,
    name: "推荐服务",
  },
  {
    id: EnumMODULETYPE.more,
    name: "更多服务",
  },
];
export const EnumVERSIONTYPE = {
  android: "ANDROID",
  ios: "IOS",
};

export const optionsVersionType = [
  {
    id: EnumVERSIONTYPE.android,
    name: "ANDROID",
  },
  {
    id: EnumVERSIONTYPE.ios,
    name: "IOS",
  },
];

export const optionsResolution = [
  {
    id: "2160P",
    name: "2160P",
  },
  {
    id: "1440P",
    name: "1440P",
  },
  {
    id: "1080P",
    name: "1080P",
  },
  {
    id: "720P",
    name: "720P",
  },
  {
    id: "544P",
    name: "544P",
  },
  {
    id: "480P",
    name: "480P",
  },
  {
    id: "360P",
    name: "360P",
  },
  {
    id: "240P",
    name: "240P",
  },
  {
    id: "144P",
    name: "144P",
  },
];
export const EnumPLATFORMTYPE = {
  ali: "ALI",
  tencent: "TENCENT",
  engage: "ENGAGE",
};
export const optionsPlatformType = [
  {
    id: EnumPLATFORMTYPE.ali,
    name: "阿里云",
  },
  {
    id: EnumPLATFORMTYPE.tencent,
    name: "腾讯云",
  },
  {
    id: EnumPLATFORMTYPE.engage,
    name: "海外极光",
  },
];
export const EnumSMSTYPE = {
  register: "REGISTER",
  registerpassword: "REGISTERPASSWORD",
  resetpassword: "RESETPASSWORD",
  changemobile: "CHANGEMOBILE",
  logoffuser: "LOGOFFUSER",
};
export const optionsSmsType = [
  {
    id: EnumSMSTYPE.register,
    name: "注册",
  },
  {
    id: EnumSMSTYPE.registerpassword,
    name: "登录",
  },
  {
    id: EnumSMSTYPE.resetpassword,
    name: "重置密码",
  },
  {
    id: EnumSMSTYPE.changemobile,
    name: "修改手机号",
  },
  {
    id: EnumSMSTYPE.logoffuser,
    name: "用户注销",
  },
];
export const EnumSCHEMETYPE = {
  cpa: "CPA",
  cps: "CPS",
  game_cps: "GAME_CPS",
};
export const optionsSchemeType = [
  {
    id: EnumSCHEMETYPE.cpa,
    name: "CPA",
  },
  {
    id: EnumSCHEMETYPE.cps,
    name: "视频",
  },
  {
    id: EnumSCHEMETYPE.game_cps,
    name: "游戏",
  },
];
export const EnumUSERTYPE = {
  all: "ALL",
  part: "PART",
};
export const optionsUserType = [
  {
    id: EnumUSERTYPE.all,
    name: "全体用户",
  },
  {
    id: EnumUSERTYPE.part,
    name: "部分用户",
  },
];
export const EnumACTIONTYPE = {
  APP: "APP",
  URL: "URL",
  PAGE: "PAGE",
};
export const optionsActionType = [
  {
    id: EnumACTIONTYPE.APP,
    name: "打开应用",
  },
  {
    id: EnumACTIONTYPE.URL,
    name: "打开链接",
  },
  {
    id: EnumACTIONTYPE.PAGE,
    name: "打开指定页面",
  },
];
export const EnumPUSHTIMETYPE = {
  NOW: "NOW",
  TIME: "TIME",
};
export const optionsPushTimeType = [
  {
    id: EnumPUSHTIMETYPE.NOW,
    name: "立即推送",
  },
  {
    id: EnumPUSHTIMETYPE.TIME,
    name: "定时推送",
  },
];
export const EnumMESSAGSTATUS = {
  all: "ALL",
  ALREADY_SEND: "ALREADY_SEND",
  WAIT_SEND: "WAIT_SEND",
  CANCEL_SEND: "CANCEL_SEND",
};
export const optionsMessageType = [
  {
    id: EnumMESSAGSTATUS.all,
    name: "全部",
  },
  {
    id: EnumMESSAGSTATUS.ALREADY_SEND,
    name: "已发送",
  },
  {
    id: EnumMESSAGSTATUS.WAIT_SEND,
    name: "待发送",
  },
  {
    id: EnumMESSAGSTATUS.CANCEL_SEND,
    name: "取消发送",
  },
];
export const EnumDismiss = {
  VIDEO_INFO: "VIDEO_INFO",
  VIDEO_CONTENT: "VIDEO_CONTENT",
};
export const optionsDismiss = [
  {
    id: EnumDismiss.VIDEO_INFO,
    name: "编辑信息不合规",
  },
  {
    id: EnumDismiss.VIDEO_CONTENT,
    name: "视频内容不合规",
  },
];
export const EnumDownload = {
  one: 1,
  zero: 0,
};
export const optionsDownload = [
  {
    id: EnumDownload.one,
    name: "开放下载",
  },
  {
    id: EnumDownload.zero,
    name: "禁止下载",
  },
];
export const EnumShowStyle = {
  DEFAULT: "DEFAULT",
  LIST: "LIST",
  BIG: "BIG",
};
export const optionsShowStyle = [
  {
    id: EnumShowStyle.DEFAULT,
    name: "默认",
  },
  {
    id: EnumShowStyle.LIST,
    name: "列表",
  },
  {
    id: EnumShowStyle.BIG,
    name: "大图",
  },
];

export const EnumTrigger = {
  CLICK: "CLICK",
  VIEW: "VIEW",
};
export const optTrigger = [
  {
    id: EnumTrigger.CLICK,
    name: "点击",
  },
  {
    id: EnumTrigger.VIEW,
    name: "浏览",
  },
];

export const EnumCallbackImme = {
  no: false,
  yes: true,
};
export const optCallbackImme = [
  {
    id: EnumCallbackImme.yes,
    name: "是",
  },
  {
    id: EnumCallbackImme.no,
    name: "否",
  },
];
export const EnumNodes = {
  PRE_MODIFY: "PRE_MODIFY",
  PRE_EXAMINE: "PRE_EXAMINE",
  VIDEO_MANAGER: "VIDEO_MANAGER",
  WATER_MARK: "WATER_MARK",
};
export const optNodes = [
  {
    id: EnumNodes.PRE_MODIFY,
    name: "视频上传列表",
  },
  {
    id: EnumNodes.PRE_EXAMINE,
    name: "违规审核",
  },
  {
    id: EnumNodes.VIDEO_MANAGER,
    name: "视频管理",
  },
  {
    id: EnumNodes.WATER_MARK,
    name: "水印处理",
  },
];
export const EnumProps = {
  SVIP: "SVIP",
  GOLD: "GOLD",
  VIDEO_CARD: "VIDEO_CARD",
  INTEGRAL: "INTEGRAL",
  UNLIMITED_WATCH: "UNLIMITED_WATCH",
};
export const optProps = [
  {
    id: EnumProps.SVIP,
    name: "超级会员",
    unit: "天",
    label: "会员赠送（天数）",
  },
  {
    id: EnumProps.GOLD,
    name: "金币",
    unit: "个",
    label: "金币赠送（个数）",
  },
  {
    id: EnumProps.VIDEO_CARD,
    name: "观影卡",
    unit: "张",
    label: "观影券赠送（张数）",
  },
  {
    id: EnumProps.INTEGRAL,
    name: "积分",
    unit: "个",
    label: " 积分赠送（个数）",
  },
  {
    id: EnumProps.UNLIMITED_WATCH,
    name: "无限观看",
    unit: "天",
  },
];
export const optionPayTypeMore = [
  {
    id: "WECHAT",
    name: "微信",
  },
  {
    id: "ALIPAY",
    name: "支付宝",
  },
  {
    id: "WALLET",
    name: "AppStore",
  },
  {
    id: EnumProps.INTEGRAL,
    name: "积分",
    unit: "个",
  },
];
export const EnumVipLogs = {
  CREATE: "CREATE",
  DELETE: "DELETE",
  EDIT: "EDIT",
  DISABLE: "DISABLE",
  ENABLE: "ENABLE",
};
export const optionVipLogs = [
  {
    id: EnumVipLogs.CREATE,
    name: "创建",
  },
  {
    id: EnumVipLogs.EDIT,
    name: "编辑",
  },
  {
    id: EnumVipLogs.DELETE,
    name: "删除",
  },
  {
    id: EnumVipLogs.DISABLE,
    name: "禁用",
  },
  {
    id: EnumVipLogs.ENABLE,
    name: "启用",
  },
];
export const Enum_Time = {
  LAST_7_DAYS: "SEVEN",
  LAST_30_DAYS: "THIRTY",
  LAST_90_DAYS: "NINETY",
};
export const optionTimeType = [
  {
    id: Enum_Time.LAST_7_DAYS,
    name: "最近7天",
  },
  {
    id: Enum_Time.LAST_30_DAYS,
    name: "最近30天",
  },
  {
    id: Enum_Time.LAST_90_DAYS,
    name: "最近90天",
  },
];
export const Enum_MovieCard = {
  EXCHANGE: "EXCHANGE",
  INVITE: "INVITE",
  LOTTERY: "LOTTERY",
  TASK: "TASK",
  NEW_USER_BENEFITS: "NEW_USER_BENEFITS", // 新用户福利
};
export const optionMovieCardSource = [
  {
    id: Enum_MovieCard.EXCHANGE,
    name: "积分兑换",
  },
  {
    id: Enum_MovieCard.LOTTERY,
    name: "积分中奖",
  },
  {
    id: Enum_MovieCard.TASK,
    name: "任务获得",
  },
  {
    id: Enum_MovieCard.NEW_USER_BENEFITS,
    name: "新用户福利",
  },
  {
    id: Enum_MovieCard.INVITE,
    name: "全民代理",
  },
];
export const Enum_points = {
  EXCHANGE_PROPS: "EXCHANGE_PROPS",
  LOTTERY_WINNING: "LOTTERY_WINNING",
  LOTTERY: "LOTTERY",
  MARKETING_TASK: "MARKETING_TASK",
};
export const optionpoints = [
  {
    id: Enum_points.MARKETING_TASK,
    name: "任务获得",
  },
  {
    id: Enum_points.EXCHANGE_PROPS,
    name: "积分兑换",
  },
  {
    id: Enum_points.LOTTERY_WINNING,
    name: "积分中奖",
  },
  {
    id: Enum_points.LOTTERY,
    name: "积分抽奖",
  },
  {
    id: Enum_MovieCard.NEW_USER_BENEFITS,
    name: "新用户福利",
  },
];
export const Enum_pointsType = {
  ADD: "ADD",
  REDUCE: "REDUCE",
};
export const optionPointsType = [
  {
    id: Enum_pointsType.ADD,
    name: "获得",
  },
  {
    id: Enum_pointsType.REDUCE,
    name: "使用",
  },
];
export const Enum_MovieCardType = {
  IN: "IN",
  OUT: "OUT",
};
export const optionMovieCardType = [
  {
    id: Enum_MovieCardType.IN,
    name: "获得",
  },
  {
    id: Enum_MovieCardType.OUT,
    name: "使用",
  },
];
export const Enum_goldCoinType = {
  IN_COME: "IN_COME",
  EXPEND: "EXPEND",
  RECHARGE: "RECHARGE",
};
export const optionGoldCoinType = [
  {
    id: Enum_goldCoinType.IN_COME,
    name: "获得",
  },
  {
    id: Enum_goldCoinType.EXPEND,
    name: "使用",
  },
  {
    id: Enum_goldCoinType.RECHARGE,
    name: "充值",
  },
];
export const Enum_goldCoin = {
  RECHARGE: "RECHARGE",
  BUY_SUBSTANCE: "BUY_SUBSTANCE",
  MARKETING_TASKS: "MARKETING_TASKS",
  LOTTERY: "LOTTERY",
  EXCHANGE: "EXCHANGE",
  INVITE_REWARDS: "INVITE_REWARDS",
};
export const optionGoldCoin = [
  {
    id: Enum_goldCoin.INVITE_REWARDS,
    name: "全民代理", // 好友邀请===》全民代理
  },
  {
    id: Enum_goldCoin.RECHARGE,
    name: "充值",
  },
  {
    id: Enum_goldCoin.BUY_SUBSTANCE,
    name: "购买视频",
  },
  {
    id: Enum_MovieCard.NEW_USER_BENEFITS,
    name: "新用户福利",
  },
];
export const Enum_blacklistSource = {
  APPLY: "APPLY",
  ARCHIVES: "ARCHIVES",
};
export const optionblacklistSource = [
  {
    id: Enum_blacklistSource.APPLY,
    name: "博主申请表",
  },
  {
    id: Enum_blacklistSource.ARCHIVES,
    name: "博主档案表",
  },
];
export const Enum_VideoScoring = {
  ALL_VIDEO: "ALL_VIDEO",
  LONG_VIDEO: "LONG_VIDEO",
  SHORT_VIDEO: "SHORT_VIDEO",
};
export const optionVideoScoring = [
  {
    id: Enum_VideoScoring.ALL_VIDEO,
    name: "全部",
  },
  {
    id: Enum_VideoScoring.LONG_VIDEO,
    name: "长视频",
  },
  {
    id: Enum_VideoScoring.SHORT_VIDEO,
    name: "短视频",
  },
];

export const EnumUserType = {
  name: "name",
  id: "id",
};
export const optUserType = [
  {
    id: EnumUserType.name,
    name: "用户昵称",
  },
  {
    id: EnumUserType.id,
    name: "用户ID",
  },
];

export const EnumSignature = {
  FAILED: "FAILED", // 未完成
  PENDING: "PENDING", // 带审核
  SIGNED: "SIGNED", // 已完成
  SIGNING: "SIGNING",
};
export const optSignature = [
  {
    id: EnumSignature.finish,
    name: "已完成",
  },
  {
    id: EnumSignature.init,
    name: "未完成",
  },
  {
    id: EnumSignature.record,
    name: "审核记录",
  },
];

export const EnumAccount = {
  NORMAL: "NORMAL",
  DISABLED: "DISABLED",
  DELETED: "DELETED",
};
export const optAccount = [
  {
    id: EnumAccount.NORMAL,
    name: "正常",
  },
  {
    id: EnumAccount.DISABLED,
    name: "禁用",
  },
  {
    id: EnumAccount.DELETED,
    name: "删除",
  },
];

export const EnumAuditStatus = {
  PASSED: "PASSED",
  PENDING: "PENDING",
  REJECT: "REJECT",
};
export const optAuditStatus = [
  {
    id: EnumAuditStatus.PASSED,
    name: "已通过",
  },
  {
    id: EnumAuditStatus.PENDING,
    name: "待审核",
  },
  {
    id: EnumAuditStatus.REJECT,
    name: "已拒绝",
  },
];

export const EnumVideoTime = {
  long: "11130",
  short: "11120",
};
export const optLong = [
  {
    id: EnumVideoTime.long,
    name: "长视频",
  },
  {
    id: EnumVideoTime.short,
    name: "短视频",
  },
];

export const EnumTaskType = {
  RECHARGE_ACTIVITY: "RECHARGE_ACTIVITY", // 充值活动
  DAILY_COMPLIMENTARY: "DAILY_COMPLIMENTARY", // 每日赠送
  CUMULATIVE_VIEWING: "CUMULATIVE_VIEWING", // 累计观看
};

export const EnumWelfare = {
  BIND_MOBILE: "BIND_MOBILE",
  SVIP: "SVIP",
};

export const optWelfare = [
  {
    id: EnumWelfare.SVIP,
    name: "超级会员",
  },
  {
    id: EnumWelfare.BIND_MOBILE,
    name: "绑定手机用户",
  },
];

export const EnumWelfareType = {
  FOUNDATIONWELFARE: "FOUNDATIONWELFARE",
  EXTRAWELFARE: "EXTRAWELFARE ",
};

export const optWelfareType = [
  {
    id: EnumWelfareType.FOUNDATIONWELFARE,
    name: "基础福利",
  },
  {
    id: EnumWelfareType.EXTRAWELFARE,
    name: "额外福利",
  },
];
export const EnumWebmasterType = {
  CPA_STATIONMASTER: "CPA_STATIONMASTER",
  CPS_STATIONMASTER: "CPS_STATIONMASTER",
  CHANNEL: "CHANNEL",
};

export const optWebmasterType = [
  {
    id: EnumWebmasterType.CHANNEL,
    name: "渠道商",
  },
  {
    id: EnumWebmasterType.CPA_STATIONMASTER,
    name: "cpa站长",
  },
  {
    id: EnumWebmasterType.CPS_STATIONMASTER,
    name: "cps站长",
  },
];
export const EnumDisType = {
  CHARGE: "CHARGE", // 充值数据
  NEW_USER: "NEW_USER", // 新增用户
};

export const EnumAdVipSkipStatus = {
  on: true, // 充值数据
  off: false, // 新增用户
};

export const EnumVideoRatio = {
  H: "H", // 横
  V: "V", // 竖
};

export const optVideoRatio = [
  {
    id: EnumVideoRatio.H,
    name: "横",
  },
  {
    id: EnumVideoRatio.V,
    name: "竖",
  },
];
export const EnumDomainType = {
  API: "API",
  CDN: "CDN",
  VIDEO_CDN: "VIDEO_CDN",
};

export const optDomainType = [
  {
    id: EnumDomainType.API,
    name: "API域名",
  },
  {
    id: EnumDomainType.CDN,
    name: "普通cdn域名",
  },
  {
    id: EnumDomainType.VIDEO_CDN,
    name: "影片cdn域名",
  },
];

export const EnumVideoStyle = {
  HORIZONTAL: "HORIZONTAL", // 横
  VERTICAL: "VERTICAL", // 竖
};

export const optVideoStyle = [
  {
    id: EnumVideoStyle.VERTICAL,
    name: "竖视频",
  },
  {
    id: EnumVideoStyle.HORIZONTAL,
    name: "横视频",
  },
];
export const EnumVideoRatioType = {
  all: 0,
  Hvideo: 1,
  Vvideo: 2,
};

export const optVideoRatioType = [
  {
    id: EnumVideoRatioType.all,
    name: "全部视频",
  },
  {
    id: EnumVideoRatioType.Hvideo,
    name: "横视频",
  },
  {
    id: EnumVideoRatioType.Vvideo,
    name: "竖视频",
  },
];

export const EnumPackage = {
  HANDING: "HANDING", // 打包中
  SUCCEED: "SUCCEED", // 打包成功
  FAILED: "FAILED", // 打包失败
};

export const optPackage = [
  {
    id: EnumPackage.HANDING,
    name: "打包中",
  },
  {
    id: EnumPackage.SUCCEED,
    name: "打包成功",
  },
  {
    id: EnumPackage.FAILED,
    name: "打包失败",
  },
];
export const EnumSliceLevel = {
  one: 1,
  two: 2,
  three: 3,
  foru: 4,
  five: 5,
};

export const optSliceLevel = [
  {
    id: EnumSliceLevel.one,
    name: "1级",
  },
  {
    id: EnumSliceLevel.two,
    name: "2级",
  },
  {
    id: EnumSliceLevel.three,
    name: "3级",
  },
  {
    id: EnumSliceLevel.foru,
    name: "4级",
  },
  {
    id: EnumSliceLevel.five,
    name: "5级 ",
  },
];
