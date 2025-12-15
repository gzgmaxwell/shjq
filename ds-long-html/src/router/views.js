import Layout from "@/page/index/index";
const router_details = [
  {
    path: "/content",
    component: Layout,
    name: "内容管理",
    children: [
      {
        path: "/content/management/details",
        name: "内容详情管理", //内容管理/视屏管理/视频编辑
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/content/management/details"
          ),
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    name: "用戶管理",
    children: [
      {
        path: "/user/details/index",
        name: "用户详情",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/user/details/index"),
      },
    ],
  },
  {
    path: "/distributor-statistics",
    component: Layout,
    name: "渠道数据统计",
    children: [
      {
        path: "/distributor-statistics/package-upload/details",
        name: "代理统计详情",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-statistics/package-upload/details.vue"
          ),
      },
    ],
  },
  {
    path: "/distributor-manage",
    component: Layout,
    name: "渠道商管理",
    children: [
      {
        path: "distributorlist/webmasterDetails/index",
        name: "查看详情",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/webmasterDetails/index"
          ),
      },
      {
        path: "/distributor-manage/distributorlist/dataStatistics/installPackageDataStatistics",
        name: "安装包数据统计",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/dataStatistics/installPackageDataStatistics"
          ),
      },
      {
        path: "/distributor-manage/distributorlist/dataStatistics/projectStatistice",
        name: "基础统计表",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/dataStatistics/projectStatistice"
          ),
      },
    ],
  },
  {
    path: "/distributor-manage",
    component: Layout,
    name: "渠道商管理",
    children: [
      {
        path: "/distributor-manage/distributorlist/distributorDetails/index",
        name: "代理详情",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/distributorDetails/index"
          ),
      },
      {
        path: "/distributor-manage/distributorlist/distributorUserList/index",
        name: "用户列表信息",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/distributorUserList/index"
          ),
      },
      {
        path: "/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/index",
        name: "用户信息",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/index"
          ),
      },
    ],
  },
  {
    path: "/marketing",
    component: Layout,
    name: "营销中心",
    children: [
      {
        path: "/marketing/adlog/details",
        name: "广告详情",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/marketing/adlog/details"
          ),
      },
    ],
  },
  {
    path: "/setting",
    component: Layout,
    name: "系统管理",
    children: [
      {
        path: "/admin/SMsMgr/smsTemplate",
        name: "短信模版",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/admin/SMsMgr/smsTemplate"
          ),
      },
    ],
  },
  {
    path: "/graphicManagement",
    component: Layout,
    name: "图文管理",
    children: [
      {
        path: "/graphicManagement/cartoon/chapter",
        name: "章节",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/graphicManagement/cartoon/chapter"
          ),
      },
    ],
  },
  {
    path: "/video-manage",
    component: Layout,
    name: "审核管理",
    children: [
      {
        path: "/video-manage/cartoonTxtCheck/chapter",
        name: "章节",
        component: () =>
          import(
            /* webpackChunkName: "page" */ "@/views/video-manage/cartoonTxtCheck/chapter"
          ),
      },
    ],
  },
];
const api_route = [
  {
    path: "/dataBoard/index",
    component: Layout,
    children: [
      {
        path: "/dataBoard/index",
        name: "看板",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/dataBoard/index"),
      },
    ],
  },
  {
    path: "/dataShortVideoBoard/index",
    component: Layout,
    children: [
      {
        path: "/dataShortVideoBoard/index",
        name: "仪表盘",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/dataShortVideoBoard/index"
          ),
      },
    ],
  },
  {
    path: "/todayData/index",
    component: Layout,
    children: [
      {
        path: "/todayData/index",
        name: "今日数据",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/todayData/index"),
      },
    ],
  },
  {
    path: "/Appinventory",
    component: Layout,
    children: [
      {
        path: "/Appinventory/mymanage/mine",
        name: '"我的"管理',
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/mymanage/mine"
          ),
      },
      {
        path: "/admin/version_new/index",
        name: "版本管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/version_new/index"
          ),
      },
      {
        path: "/report-and-feedback/help/index",
        name: "帮助问题管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/help/index"
          ),
      },
      {
        path: "/admin/suggest-feed/index",
        name: "反馈和建议",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/suggest-feed/index"
          ),
      },
      {
        path: "/Appinventory/installPackgeUpload/index",
        name: "安装包上传",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/installPackgeUpload/index"
          ),
      },
      {
        path: "/Appinventory/language/index",
        name: "国际化管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/language/index"
          ),
      },
      {
        path: "/Appinventory/otherSettings/index",
        name: "其他设置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/otherSettings/index"
          ),
      },
      {
        path: "/Appinventory/crashLog/index",
        name: "崩溃日志",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/crashLog/index"
          ),
      },
      {
        path: "/Appinventory/domainReporting/index",
        name: "域名上报记录",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/domainReporting/index"
          ),
      },
      {
        path: "/Appinventory/lineOptimize/index",
        name: "线路优化域名管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/lineOptimize/index"
          ),
      },
      {
        path: "/Appinventory/theme/index",
        name: "风格管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/Appinventory/theme/index"
          ),
      },
    ],
  },
  {
    path: "/productManagement",
    component: Layout,
    children: [
      {
        path: "/productManagement/setMeal/index",
        name: "套餐管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/productManagement/setMeal/index"
          ),
      },
      {
        path: "/productManagement/tenantUser/index",
        name: "租户管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/productManagement/tenantUser/index"
          ),
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "/user/userList/index",
        name: "用户列表",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/user/userList/index"),
      },
      {
        path: "/user/avatarLibrary/index",
        name: "用户头像库",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/user/avatarLibrary/index"
          ),
      },
    ],
  },
  {
    path: "/video-manage",
    component: Layout,
    children: [
      {
        path: "/video-manage/videoList/index",
        name: "视频上传列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/videoList/index"
          ),
      },
      {
        path: "/video-manage/supplyVideoList/index",
        name: "供应商视频上传列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/supplyVideoList/index"
          ),
      },
      {
        path: "/video-manage/waterMarkList/index",
        name: "水印处理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/waterMarkList/index"
          ),
      },
      {
        path: "/video-manage/violationCheck/index",
        name: "违规审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/violationCheck/index"
          ),
      },
      {
        path: "/video-manage/audit-record/audit-record",
        name: "审核记录",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/audit-record/audit-record"
          ),
      },
      {
        path: "/video-manage/audit-record/my-audit-record",
        name: "我的审核记录",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/audit-record/my-audit-record"
          ),
      },
      {
        path: "/video-manage/dissentingPool/index",
        name: "异议池",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/dissentingPool/index"
          ),
      },
      {
        path: "/video-manage/waterMark/index",
        name: "水印管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/waterMark/index"
          ),
      },
      {
        path: "/video-manage/dismissReasons/index",
        name: "驳回原因",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/dismissReasons/index"
          ),
      },
      {
        path: "/video-manage/cartoonTxtCheck/index",
        name: "图文信息审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/cartoonTxtCheck/index"
          ),
      },
      {
        path: "/video-manage/cartoonViolationCheck/index",
        name: "图文违规审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/video-manage/cartoonViolationCheck/index"
          ),
      },
    ],
  },
  {
    path: "/content",
    component: Layout,
    children: [
      {
        path: "/content/management/index",
        name: "视频管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/management/index"
          ),
      },
      {
        path: "/content/discuss/claims",
        name: "评论审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/discuss/claims"
          ),
      },
      {
        path: "/content/discuss/record",
        name: "弹幕审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/discuss/record"
          ),
      },
      {
        path: "/content/recommend/manage",
        name: "推荐管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/recommend/manage"
          ),
      },
      {
        path: "/content/searchStatistics/index",
        name: "搜索统计",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/searchStatistics/index"
          ),
      },
      {
        path: "/content/sensitive/index",
        name: "敏感词库",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/sensitive/index"
          ),
      },
      {
        path: "/content/classify/index",
        name: "标签管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/classify/index"
          ),
      },
      {
        path: "/content/triateralplatform/index",
        name: "三方平台管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/triateralplatform/index"
          ),
      },
      {
        path: "/content/referralPool/index",
        name: "推荐池管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/referralPool/index"
          ),
      },
      {
        path: "/content/timelineIcon/index",
        name: "时间轴ICON管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/timelineIcon/index"
          ),
      },
      {
        path: "/content/dynamic/index",
        name: "动态管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/dynamic/index"
          ),
      },
      {
        path: "/content/freePool/index",
        name: "免费池",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/freePool/index"
          ),
      },
      {
        path: "/content/weightManagement/index",
        name: "权重管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/weightManagement/index"
          ),
      },
      {
        path: "/content/timestampStatistics/index",
        name: "时间戳统计",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/content/timestampStatistics/index"
          ),
      },
    ],
  },
  {
    path: "/marketing",
    component: Layout,
    children: [
      {
        path: "/marketing/planning/index",
        name: "活动中心",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/planning/index"
          ),
      },
      {
        path: "/marketing/game/index",
        name: "游戏中心",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/game/index"
          ),
      },
      {
        path: "/marketing/advertise/index",
        name: "广告管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/advertise/index"
          ),
      },
      {
        path: "/marketing/topsearch/index",
        name: "热搜管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/topsearch/index"
          ),
      },
      {
        path: "/marketing/message-center/index",
        name: "消息中心",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/message-center/index"
          ),
      },
      {
        path: "/marketing/topicstore/index",
        name: "话题库",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/topicstore/index"
          ),
      },
      {
        path: "/marketing/adlog/index",
        name: "广告日志",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/adlog/index"
          ),
      },
      {
        path: "/marketing/task/index",
        name: "任务中心",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/task/index"
          ),
      },
      {
        path: "/marketing/friendInvitation/appScheme",
        name: "好友邀请",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/friendInvitation/appScheme"
          ),
      },
      {
        path: "/marketing/bloggerChargingManage/index",
        name: "充电博主管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/bloggerChargingManage/index"
          ),
      },
      {
        path: "/marketing/bloggerRevenue/index",
        name: "博主收益申请表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/marketing/bloggerRevenue/index"
          ),
      },
    ],
  },
  {
    path: "/report-and-feedback",
    component: Layout,
    children: [
      {
        path: "/report-and-feedback/video/index",
        name: "视频举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/video/index"
          ),
      },
      {
        path: "/report-and-feedback/comment-on/index",
        name: "评论举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/comment-on/index"
          ),
      },
      {
        path: "/report-and-feedback/bullet-chat/index",
        name: "弹幕举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/bullet-chat/index"
          ),
      },
      {
        path: "/report-and-feedback/user/index",
        name: "用户举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/user/index"
          ),
      },
      {
        path: "/report-and-feedback/violation/index",
        name: "违规原因",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/violation/index"
          ),
      },
      {
        path: "/report-and-feedback/advertising-complaint/index",
        name: "广告投诉",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/report-and-feedback/advertising-complaint/index"
          ),
      },
    ],
  },
  {
    path: "/nationalagent",
    component: Layout,
    children: [
      {
        path: "/nationalagent/nationalAgency/index",
        name: "代理权益配置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/nationalAgency/index"
          ),
      },
      {
        path: "/nationalagent/agentManage/index",
        name: "代理管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/agentManage/index"
          ),
      },
      {
        path: "/nationalagent/originConfig/index",
        name: "域名配置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/originConfig/index"
          ),
      },
      {
        path: "/nationalagent/agentRewardConfig/index",
        name: "代理奖励配置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/agentRewardConfig/index"
          ),
      },
      {
        path: "/nationalagent/hierarchy/index",
        name: "层级关系",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/hierarchy/index"
          ),
      },
      {
        path: "/nationalagent/warningCofig/index",
        name: "预警配置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/warningCofig/index"
          ),
      },
      {
        path: "/nationalagent/warningNotice/index",
        name: "预警通知",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/nationalagent/warningNotice/index"
          ),
      },
    ],
  },
  {
    path: "/business-manage",
    component: Layout,
    children: [
      {
        path: "/business-manage/coinMenu/index",
        name: "金币套餐",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/coinMenu/index"
          ),
      },
      {
        path: "/business-manage/memberMenu/index",
        name: "会员套餐",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/memberMenu/index"
          ),
      },
      {
        path: "/business-manage/memberList/index",
        name: "会员列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/memberList/index"
          ),
      },
      {
        path: "/business-manage/orderGoodsList/index",
        name: "订单列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/orderGoodsList/index"
          ),
      },
      {
        path: "/business-manage/memberBenefits/index",
        name: "会员权益",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/memberBenefits/index"
          ),
      },
      {
        path: "/business-manage/channelRevenueDetail/index",
        name: "收益明细表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/channelRevenueDetail/index"
          ),
      },
      {
        path: "/business-manage/paymentStatistics/index",
        name: "付费购买统计",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/business-manage/paymentStatistics/index"
          ),
      },
    ],
  },
  {
    path: "/withdraw",
    component: Layout,
    children: [
      {
        path: "/withdraw/bloggerCharging/index",
        name: "充电博主提现列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/withdraw/bloggerCharging/index"
          ),
      },
      {
        path: "/withdraw/nationalWithdraw/index",
        name: "全民代理提现",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/withdraw/nationalWithdraw/index"
          ),
      },
    ],
  },
  {
    path: "/burialevent",
    component: Layout,
    children: [
      {
        path: "/burialevent/visualization/index",
        name: "可视化埋点",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/burialevent/visualization/index"
          ),
      },
      {
        path: "/burialevent/attributestore/index",
        name: "属性库",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/burialevent/attributestore/index"
          ),
      },
    ],
  },
  {
    path: "/admin",
    component: Layout,
    children: [
      {
        path: "/admin/user/index",
        name: "用户管理",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/user/index"),
      },
      {
        path: "/admin/menu/index",
        name: "菜单管理",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/menu/index"),
      },
      {
        path: "/admin/role/index",
        name: "角色管理",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/role/index"),
      },
      {
        path: "/admin/securityCenter/index",
        name: "安全中心",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/securityCenter/index"
          ),
      },
      {
        path: "/admin/platformManage/index",
        name: "平台管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/platformManage/index"
          ),
      },
      {
        path: "/admin/dept/index",
        name: "部门管理",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/dept/index"),
      },
    ],
  },
  {
    path: "/setting",
    component: Layout,
    children: [
      {
        path: "/admin/videoUploadSet/index",
        name: "视频相关设置",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/videoUploadSet/index"
          ),
      },
      {
        path: "/admin/package/index",
        name: "安装包生成",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/package/index"),
      },
      {
        path: "/admin/dict/index",
        name: "字典管理",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/dict/index"),
      },
      {
        path: "/admin/SMsMgr/index",
        name: "短信备案",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/SMsMgr/index"),
      },
      {
        path: "/admin/systemMaintenance/index",
        name: "系统维护",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/admin/systemMaintenance/index"
          ),
      },
    ],
  },
  {
    path: "/distributor-statistics",
    component: Layout,
    children: [
      {
        path: "/distributor-statistics/package-upload/index",
        name: "安装包统计",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/distributor-statistics/package-upload/index"
          ),
      },
    ],
  },
  {
    path: "/distributor-manage",
    component: Layout,
    children: [
      {
        path: "/distributor-manage/distributorlist/index",
        name: "渠道商列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/distributor-manage/distributorlist/index"
          ),
      },
      {
        path: "/distributor-manage/distributor-scheme/index",
        name: "渠道商方案管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/distributor-manage/distributor-scheme/index"
          ),
      },
      {
        path: "/distributor-manage/userRelationships/index",
        name: " 用户关系列表",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/distributor-manage/userRelationships/index"
          ),
      },
      {
        path: "/distributor-manage/signature/index",
        name: "签名包申请管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/distributor-manage/signature/index"
          ),
      },
    ],
  },
  {
    path: "/graphicManagement",
    component: Layout,
    children: [
      {
        path: "/graphicManagement/commentModeration/index",
        name: "漫画评论审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/commentModeration/index"
          ),
      },
      {
        path: "/graphicManagement/commentReport/index",
        name: "漫画评论举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/commentReport/index"
          ),
      },
      {
        path: "/graphicManagement/comicBookReport/index",
        name: "漫画举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/comicBookReport/index"
          ),
      },
      {
        path: "/graphicManagement/cartoon/index",
        name: "漫画管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/cartoon/index"
          ),
      },
      {
        path: "/graphicManagement/novelReport/index",
        name: "小说举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/novelReport/index"
          ),
      },
      {
        path: "/graphicManagement/novelCommentModeration/index",
        name: "小说评论审核",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/novelCommentModeration/index"
          ),
      },
      {
        path: "/graphicManagement/novelCommentReport/index",
        name: "小说评论举报",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/novelCommentReport/index"
          ),
      },
      {
        path: "/graphicManagement/novel/index",
        name: "小说管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/novel/index"
          ),
      },
      {
        path: "/graphicManagement/comicRecommend/index",
        name: "漫画推荐管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/comicRecommend/index"
          ),
      },
      {
        path: "/graphicManagement/novelRecommend/index",
        name: "小说推荐管理",
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/graphicManagement/novelRecommend/index"
          ),
      },
    ],
  },
];
const routeList = [
  {
    path: "/wel",
    component: Layout,
    redirect: "/wel/index",
    children: [
      {
        path: "index",
        name: "首页",
        component: () => import(/* webpackChunkName: "views" */ "@/page/wel"),
      },
    ],
  },
  {
    path: "/info",
    component: Layout,
    redirect: "/info/index",
    children: [
      {
        path: "index",
        name: "个人信息",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/admin/user/info"),
      },
    ],
  },
  ...api_route,
];

routeList.forEach((v) => {
  router_details.forEach((m) => {
    if (v.path === m.path) {
      if (Array.isArray(v.children) && Array.isArray(m.children)) {
        v.children.push(...m.children);
      }
    }
  });
});

export default routeList;
