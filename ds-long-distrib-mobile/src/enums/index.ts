export const optionConsumeType = [
  {
    id: 'RECHARGE',
    name: '充值'
  },
  {
    id: 'BUY_VIP',
    name: '购买会员'
  }
]

export const optionPayStatus = [
  {
    id: 'NOT_PAY',
    name: '待支付'
  },
  {
    id: 'PAYING',
    name: '支付中'
  },
  {
    id: 'CANCEL',
    name: '已取消'
  },
  {
    id: 'FAIL',
    name: '支付失败'
  },
  {
    id: 'COMPLETE',
    name: '支付成功'
  }
]
export const optionPayType = [
  {
    id: 'WECHAT',
    name: '微信'
  },
  {
    id: 'ALIPAY',
    name: '支付宝'
  },
  {
    id: 'WALLET',
    name: '银联支付'
  }
]

export const EnumPayTypeWay = {
  wxpay: 'wxpay',
  alipay: 'alipay',
  bankPay: 'bankPay'
}
export const optionPayTypeWay = [
  {
    id: EnumPayTypeWay.wxpay,
    name: '微信',
    label: '微信账号'
  },
  {
    id: EnumPayTypeWay.alipay,
    name: '支付宝',
    label: '支付宝账号'
  },
  {
    id: EnumPayTypeWay.bankPay,
    name: '银联支付',
    label: '银联支付'
  }
]

export const optionOrderStatus = [
  {
    id: '1',
    name: '待审核'
  },
  {
    id: '2',
    name: '提现中'
  },
  {
    id: '3',
    name: '提现成功'
  },
  {
    id: '4',
    name: '提现失败'
  }
]

export const optionWithdraw = [
  {
    id: 'DAY',
    name: '日结'
  },
  {
    id: 'WEEK',
    name: '周结'
  },
  {
    id: 'MONTH',
    name: '月结'
  }
]

export const EnumProxyStatus = { NORMAL: 'NORMAL', DISABLED: 'DISABLED', DELETED: 'DELETED' }

export const optionProxyStatus = [
  {
    id: EnumProxyStatus.NORMAL,
    name: '正常'
  },
  {
    id: EnumProxyStatus.DISABLED,
    name: '禁用'
  },
  {
    id: EnumProxyStatus.DELETED,
    name: '删除'
  }
]

export const optionWithdrawWay = [
  {
    id: 'CPA',
    name: 'CPA'
  },
  {
    id: 'CPS',
    name: 'CPS'
  }
]

export const optionBank = [
  {
    id: '1',
    name: '建设银行'
  },
  {
    id: '2',
    name: '工商银行'
  }
]

export const optionWithdrawStatus = [
  {
    id: 'pending',
    name: '待审核'
  },
  {
    id: 'withdrawing',
    name: '待审核'
  },
  {
    id: 'succeed',
    name: '提现成功'
  },
  {
    id: 'failed',
    name: '提现失败'
  }
]

export const GenPackageStatus = {
  PEDING: 'PEDING',
  HANDING: 'HANDING',
  SUCCEED: 'SUCCEED',
  FAILED: 'FAILED'
}
export const optionGenPackageStatus = [
  {
    id: GenPackageStatus.PEDING,
    name: '待打包'
  },
  {
    id: GenPackageStatus.HANDING,
    name: '打包中'
  },
  {
    id: GenPackageStatus.SUCCEED,
    name: '打包成功'
  },
  {
    id: GenPackageStatus.FAILED,
    name: '打包失败'
  }
]

export const ENUM_DIC_TYPE = {
  recommend_level: 'recommend_level', // 视频推荐等级
  watch_power: 'watch_power', // 视频观看权限
  download_power: 'download_power', // 视频下载权限
  sort_level: 'sort_level', // 排序等级
  ban_duration: 'ban_duration', // 封禁时长
  language_select: 'language_select', // 语言选择
  scheme_type: 'scheme_type', // 方案类型
  package: 'package', // 项目包类型
  platform_ratio: 'platform_ratio' // 平台佣金类型
}
