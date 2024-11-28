// 视频记录模板
export const tabsList = [
  {
    label: "视频审核记录",
    name: "0",
    title: "视频列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "videoTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
      {
        label: "审核用户名查询",
        name: "username",
        labelWidth: "180",
        place: "请输入审核用户名",
        value: "",
      },
    ],
    tableOperation: {
      label: "操作",
      labelWidth: "120",
      align: "center",
      btnList: [
        {
          label: "查看",
          type: "serch",
        },
      ],
    },
    tableColumns: [
      {
        label: "视频信息",
        param: "videoTitle",
        imgShow: true,
        align: "center",
        width: "98",
      },
      {
        label: "视频标题",
        param: "videoTitleZyy",
        align: "center",
      },

      {
        label: "审核用户名",
        param: "username",
        align: "center",
      },
      {
        label: "审核员姓名",
        param: "realName",
        align: "center",
      },
      {
        label: "发布时间",
        param: "publishTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核时间",
        param: "createTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核操作",
        param: "type",
        align: "center",
      },
      {
        label: "审核意见",
        param: "refuseReason",
        align: "center",
      },
      {
        label: "审核流程",
        param: "workRounds",
        align: "center",
      },
      {
        label: "视频状态",
        param: "videoType",
        filterShow: true,
        align: "center",
      },
    ],
  },
  {
    label: "评论审核记录",
    name: "1",
    title: "评论列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "substanceTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
      {
        label: "审核用户名查询",
        name: "userName",
        labelWidth: "180",
        place: "请输入审核用户名",
        value: "",
      },
    ],
    tableColumns: [
      {
        label: "评论内容",
        param: "commentContent",
        align: "center",
      },
      {
        label: "审核用户名",
        param: "auditUserName",
        align: "center",
      },
      {
        label: "来源视频",
        param: "videoTitleZyy",
        align: "center",
      },
      {
        label: "发布时间",
        param: "commentPublishTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核时间",
        param: "auditTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核操作",
        param: "auditStatus",
        align: "center",
      },
    ],
  },
  {
    label: "弹幕审核记录",
    name: "2",
    title: "弹幕列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "videoTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
      {
        label: "审核用户名查询",
        name: "auditName",
        labelWidth: "180",
        place: "请输入审核用户名",
        value: "",
      },
    ],
    tableColumns: [
      {
        label: "弹幕内容",
        param: "content",
        align: "center",
      },
      {
        label: "审核用户名",
        param: "auditName",
        align: "center",
      },
      {
        label: "来源视频",
        param: "videoTitleZyy",

        imgShow: false,
      },
      {
        label: "发布时间",
        param: "createTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核时间",
        param: "auditTime",
        sortable: true,
        align: "center",
      },
      {
        label: "审核操作",
        param: "status",
        align: "center",
      },
    ],
  },
  {
    label: "下架视频记录",
    name: "3",
    title: "视频列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "videoTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
      {
        label: "作者查询",
        name: "username",
        labelWidth: "100",
        place: "请输入作者名",
        value: "",
      },
      {
        label: "下架用户查询",
        name: "updateUsername",
        labelWidth: "140",
        place: "请输入下架用户名",
        value: "",
      },
    ],
    tableOperation: {
      label: "操作",
      labelWidth: "120",
      align: "center",
      btnList: [
        {
          label: "重新上架",
          type: "edit",
        },
      ],
    },
    tableColumns: [
      {
        label: "视频信息",
        param: "videoTitle",
        imgShow: true,
      },
      {
        label: "作者",
        param: "createUsername",
        align: "center",
      },
      {
        label: "发布时间",
        param: "publishTime",
        sortable: true,
        align: "center",
      },
      {
        label: "下架用户",
        param: "updateUsername",
        align: "center",
      },
      {
        label: "下架时间",
        param: "updateTime",
        sortable: true,
        align: "center",
      },
    ],
    handleClick: true,
  },
]; //选项卡
export const myTabsList = [
  {
    label: "视频审核记录",
    name: "0",
    title: "视频列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "videoTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
    ],
    tableColumns: [
      {
        label: "视频信息",
        param: "videoTitle",
        imgShow: true,
        align: "center",
        width: "98",
      },
      {
        label: "视频标题",
        param: "videoTitleZyy",
        align: "center",
      },
      {
        label: "发布时间",
        sortable: true,
        param: "publishTime",
        align: "center",
      },
      {
        label: "审核时间",
        sortable: true,
        param: "createTime",
        align: "center",
      },
      {
        label: "审核操作",
        param: "type",
        align: "center",
      },
      {
        label: "审核意见",
        param: "refuseReason",
        align: "center",
      },
      {
        label: "审核流程",
        param: "workRounds",
        align: "center",
      },
      {
        label: "视频状态",
        param: "videoType",
        align: "center",
      },
    ],
  },
  {
    label: "评论审核记录",
    name: "1",
    title: "评论列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "substanceTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
    ],
    tableColumns: [
      {
        label: "评论内容",
        param: "commentContent",
      },
      {
        label: "来源视频",
        param: "videoTitleZyy",
      },
      {
        label: "发布时间",
        sortable: true,
        param: "commentPublishTime",
      },
      {
        label: "审核时间",
        sortable: true,
        param: "auditTime",
      },
      {
        label: "审核操作",
        param: "auditStatus",
      },
    ],
  },
  {
    label: "弹幕审核记录",
    name: "2",
    title: "弹幕列表",
    resetShow: true,
    searchList: [
      {
        label: "视频查询",
        name: "videoTitle",
        labelWidth: "100",
        place: "请输入视频名称",
        value: "",
      },
    ],
    tableColumns: [
      {
        label: "弹幕内容",
        param: "content",
      },
      {
        label: "来源视频",
        param: "videoTitleZyy",
        imgShow: false,
      },
      {
        label: "发布时间",
        sortable: true,
        param: "createTime",
      },
      {
        label: "审核时间",
        sortable: true,
        param: "auditTime",
      },
      {
        label: "审核操作",
        param: "status",
      },
    ],
  },
];
