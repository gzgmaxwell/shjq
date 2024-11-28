import request from '../request'

export const orderPage = (data: any) => {
  return request({
    url: '/trade/web/order/page',
    method: 'post',
    data
  })
}

// 渠道商账户 Ext User Acco Controller
export const extUserAccoGetByUserIds = (data: any) => {
  return request({
    url: '/trade/web/extUserAcco/getByUserIds',
    method: 'post',
    data
  })
}

// 推广提现订单 Extension Withdraw Order Controller
export const extensionWithdrawOrderAdd = (data: any) => {
  return request({
    url: '/trade/web/extensionWithdrawOrder/add',
    method: 'post',
    data
  })
}
