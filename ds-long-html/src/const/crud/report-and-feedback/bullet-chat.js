export const tabList = {
    resetShow:true,
    queryType:'BULLET',
    searchList: [
        {
            label: "发表用户",
            name: "searchKey",
            labelWidth: "100",
            place: "请输入发表用户",
            value: "",
        },
        {
            label: "检举用户",
            name: "userName",
            labelWidth: "100",
            place: "请输入检举用户",
            value: "",
        },
        {
            label: "检举时间",
            name: "time",
            labelWidth: "70",
            place: "请输入操作时间",
            value: "",
            formType:'date',
        },
    ],
    tableOperation: {
        label: "操作",
        labelWidth:'150',
        align: 'center',
        btnList: [
          {
            label: "无违规",
            type: "adopt",
          },
          {
            label: "删除",
            type: "chat_delete",
            color:'red',
          },
          {
            label: "封禁",
            type: "seal",
            color:'red',
          },
        ],
      },
    tableColumns: [
        {
            label: "弹幕",
            param: "bulletInfo",
            align: 'center',
        },
        {
            label: "发表用户",
            param: "targetUserName",
            align: 'center',
        },
        {
            label: "举报原因",
            param: "accusationClassifyName",
            align: 'center',
        },
        {
            label: "详细说明",
            param: "accusationContent",
            align: 'center',
        },
        {
            label: "检举用户",
            param: "accusationUserName",
            align: 'center',
        },
        {
            label: "举报时间",
            param: "accusationTime",
            align: 'center',
        },
    ],
}