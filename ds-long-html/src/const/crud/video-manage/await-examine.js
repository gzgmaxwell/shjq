export const tabList = {
  resetShow: true,
  searchList: [
    {
      label: "视频标题",
      name: "videoTitle",
      labelWidth: "100",
      place: "请输入视频标题",
      value: "",
    },
    {
      label: "上传用户",
      name: "username",
      labelWidth: "100",
      place: "请输入上传用户",
      value: "",
    },
    {
      label: "分类",
      name: "classifyId",
      labelWidth: "40",
      formType: "cascader",
      value: "",
      props: {
        label: "classifyName",
        value: "id",
        children: "childClassifyList",
      },
    },
  ],
  tableOperation: {
    label: "操作",
    labelWidth: "150",
    align: "center",
    btnList: [
      {
        label: "通过",
        type: "dist",
        color: "rgb(53, 204, 103)",
      },
      {
        label: "不通过",
        type: "dist1",
        color: "red",
      },
      {
        label: "编辑",
        type: "exam",
      },
    ],
  },
  tableColumns: [
    {
      label: "视频信息",
      sortable: false,
      param: "videoTitle",
      imgShow: true,
      align: "center",
      width: "98",
    },
    {
      label: "上传用户",
      param: "createUsername",
      align: "center",
    },
    {
      label: "上传时间",
      sortable: true,
      param: "createTime",
      align: "center",
    },
    {
      label: "分类",
      param: "classifyName",
      align: "center",
    },
    {
      label: "审核状态",
      param: "type",
      align: "center",
    },
    {
      label: "审核人",
      param: "username",
      align: "center",
    },
  ],
};
