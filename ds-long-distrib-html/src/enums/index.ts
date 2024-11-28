export const optConsumeType = [
  {
    id: "RECHARGE",
    name: "金币充值",
  },
  {
    id: "BUY_SVIP",
    name: "超级会员",
  },
  // {
  //   id: "REGISTER",
  //   name: "注册",
  // },
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
    name: "银联支付",
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

export const EnumWithdraw = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
};

export const optionWithdraw = [
  {
    id: EnumWithdraw.DAY,
    name: "日结",
  },
  {
    id: EnumWithdraw.WEEK,
    name: "周结",
  },
  {
    id: EnumWithdraw.MONTH,
    name: "月结",
  },
];

export const EnumProxyStatus = { NORMAL: "NORMAL", DISABLED: "DISABLED", DELETED: "DELETED" };

export const optionProxyStatus = [
  {
    id: EnumProxyStatus.NORMAL,
    name: "启用",
  },
  {
    id: EnumProxyStatus.DISABLED,
    name: "禁用",
  },
  // {
  //   id: EnumProxyStatus.DELETED,
  //   name: "删除",
  // },
];

export const enums_schType = {
  CPS: "CPS",
  GAME_CPS: "GAME_CPS", // 游戏
  CPA: "CPA",
};

export const optionWithdrawWay = [
  {
    id: enums_schType.CPA,
    name: "CPA",
  },
  {
    id: enums_schType.CPS,
    name: "CPS",
  },
];

export const optionSchemeType = [
  {
    id: enums_schType.CPA,
    name: "CPA 方案",
  },
  {
    id: enums_schType.CPS,
    name: "CPS 方案",
  },
];

export const optionBank = [
  {
    id: "1",
    name: "建设银行",
  },
  {
    id: "2",
    name: "工商银行",
  },
];

export const EnumWithdrawStatus = {
  pending: "PENDING",
  withdrawing: "WITHDRAWING",
  succeed: "SUCCEED",
  failed: "FAILED",
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
];

export const GenPackageStatus = {
  PEDING: "PEDING",
  HANDING: "HANDING",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
};
export const optionGenPackageStatus = [
  {
    id: GenPackageStatus.PEDING,
    name: "待打包",
  },
  {
    id: GenPackageStatus.HANDING,
    name: "打包中",
  },
  {
    id: GenPackageStatus.SUCCEED,
    name: "打包成功",
  },
  {
    id: GenPackageStatus.FAILED,
    name: "打包失败",
  },
];

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
};

export const EnumLanguage = {
  zhCn: "zh-cn",
  zhTw: "zh-tw",
  en: "en",
};
export const optionLanguage = [
  {
    value: EnumLanguage.zhCn,
    label: "简体中文",
  },
  {
    value: EnumLanguage.zhTw,
    label: "繁体中文",
  },
  {
    value: EnumLanguage.en,
    label: "English",
  },
];

export const EnumOrder = {
  WITHDRAW_AUDIT_PASS: "WITHDRAW_AUDIT_PASS", // 审核通过
  WITHDRAW_AUDIT_REJECT: "WITHDRAW_AUDIT_REJECT", // 提现审核失败
  WITHDRAW_MONEY_TRANSFER_SUCCESS: "WITHDRAW_MONEY_TRANSFER_SUCCESS", // 提现汇款成功
  WITHDRAW_MONEY_TRANSFER_FAIL: "WITHDRAW_MONEY_TRANSFER_FAIL", // 提现汇款失败
};
export const optOrder = [
  {
    id: EnumOrder.WITHDRAW_AUDIT_PASS,
    label: "审核通过",
    des: '您发起的提现，订单"%s"审核通过，汇款处理中',
  },
  {
    id: EnumOrder.WITHDRAW_AUDIT_REJECT,
    label: "提现审核失败",
    des: '您发起的提现，订单"%s"审核未通过，失败原因：%s',
  },
  {
    id: EnumOrder.WITHDRAW_MONEY_TRANSFER_SUCCESS,
    label: "提现汇款成功",
    des: '您发起的提现，订单"%s"汇款成功',
  },
  {
    id: EnumOrder.WITHDRAW_MONEY_TRANSFER_FAIL,
    label: "提现汇款失败",
    des: '您发起的提现，订单"%s"汇款失败，失败原因：%s',
  },
];

export const EnumPackgeStatus = {
  PASSED: "PASSED",
  REJECT: "REJECT",
  PENDING: "PENDING",
};
export const optPackgeStatus = [
  {
    id: EnumPackgeStatus.PASSED,
    name: "已通过",
  },
  {
    id: EnumPackgeStatus.REJECT,
    name: "已拒绝",
  },
];

export const signStatus = {
  PENDING: "PENDING", // 待签名
  APPLYING: "APPLYING", // 申请中
  SIGNING: "SIGNING", // 签名中
  SIGNED: "SIGNED", // 已签名
  FAILED: "FAILED", // 签名失败(回绝申请)
  DELETED: "DELETED", // 已删除
};
export const optSignStatus = [
  {
    id: signStatus.PENDING,
    name: "待签名",
  },
  {
    id: signStatus.APPLYING,
    name: "已提交申请",
  },
  {
    id: signStatus.SIGNING,
    name: "签名中",
  },
  {
    id: signStatus.SIGNED,
    name: "已签名",
  },
  {
    id: signStatus.FAILED,
    name: "回绝申请",
  },
  {
    id: signStatus.DELETED,
    name: "回绝申请", //用相同的名字
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
    label: "长视频平台",
  },
  {
    id: EnumVideoTime.short,
    name: "短视频",
    label: "短视频平台",
  },
];

export const EnumSecurityCenterStatus = {
  ON: 0,
  OFF: 1,
};
export const optSecurityCenterStatus = [
  {
    id: EnumSecurityCenterStatus.ON,
    name: "启用",
  },
  {
    id: EnumSecurityCenterStatus.OFF,
    name: "禁用",
  },
];

export const EnumWebmasterType = {
  CPA_STATIONMASTER: "CPA_STATIONMASTER",
  CPS_STATIONMASTER: "CPS_STATIONMASTER",
  CPT_STATIONMASTER: "CPT_STATIONMASTER",
  CHANNEL: "CHANNEL",
  DISTRIBUTOR: "DISTRIBUTOR",
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
  {
    id: EnumWebmasterType.CPT_STATIONMASTER,
    name: "cpt站长",
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
export const EnumDisType = {
  CHARGE: "CHARGE", // 充值数据
  NEW_USER: "NEW_USER", // 新增用户
};
