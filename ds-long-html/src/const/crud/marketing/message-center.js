import { verificationTime, checkUrl, checkRoute } from "@/util/validate.js";

export const tableOption = {
  menuPosition: "left",
  dialogTop: "110",
  align: "center",
  searchMenuSpan: 6,
  addBtnText: "发送消息",
  viewBtn: true,
  dialogWidth: "40%",
  editBtn: false,
  delBtn: false,
  border: true,
  stripe: true,
  refreshBtn: false,
  column: [
    {
      label: "消息描述",
      prop: "msgDescription",
      span: 24,
      rules: [
        {
          required: true,
          message: "消息描述不能为空",
          trigger: "blur",
        },
      ],
    },
    {
      label: "消息描述",
      prop: "msgDesc",
      span: 24,
      search: true,
      viewDisplay: false,
      hide: true,
      showColumn: false,
      addDisplay: false,
      editDisplay: false,
    },
    {
      label: "标题",
      span: 24,
      prop: "msgTitle",
      rules: [
        {
          required: true,
          message: "标题不能为空",
          trigger: "blur",
        },
      ],
    },
    {
      label: "内容",
      type: "textarea",
      span: 24,
      prop: "msgContent",
      hide: true,
      showColumn: false,
      rules: [
        {
          required: true,
          message: "内容不能为空",
          trigger: "blur",
        },
      ],
    },
    {
      label: "图片",
      span: 24,
      prop: "image",
      hide: true,
      value: [],
      viewDisplay: false,
      showColumn: false,
    },
    {
      label: "图片",
      span: 24,
      prop: "msgImg",
      hide: true,
      editDisplay: false,
      showColumn: false,
      addDisplay: false,
    },
    {
      label: "目标用户",
      type: "radio",
      dicData: [
        { label: "全体用户", value: "ALL" },
        { label: "部分用户", value: "PART" },
      ],
      value: "ALL",
      span: 24,
      prop: "targetUser",
      showColumn: false,
      hide: true,
    },
    {
      span: 24,
      type: "select",
      prop: "appUserIds",
      hide: true,
      dicData: [],
      placeholder: "请选择部分用户",
      filterable: true,
      multiple: true,
      props: {
        label: "username",
        value: "userId",
      },
      rules: [
        {
          required: true,
          message: "至少选择一个用户",
          trigger: "change",
        },
      ],
      addDisplay: false,
      editDisplay: false,
      showColumn: false,
      viewDisplay: false,
    },
    {
      label: "后续动作",
      type: "radio",
      dicData: [
        { label: "打开应用", value: "APP" },
        { label: "打开链接", value: "URL" },
        { label: "打开指定页面", value: "PAGE" },
      ],
      value: "APP",
      span: 24,
      prop: "followUpAction",
      hide: true,
      showColumn: false,
    },
    {
      span: 24,
      prop: "followUpActionDetails",
      hide: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      placeholder: "请输入以Http/Https开头的RUL地址",
      rules: [
        { required: true, message: "RUL地址不能为空" },
        { validator: checkUrl, trigger: "blur" },
      ],
      showColumn: false,
    },
    {
      span: 24,
      prop: "followUpActionDetails",
      hide: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      showColumn: false,
      placeholder: "请输入跳转路由",
      rules: [{ required: false, message: "跳转路由不能为空" }],
    },
    {
      label: "发送人",
      span: 24,
      prop: "sendUserName",
      addDisplay: false,
      editDisplay: false,
    },
    {
      label: "消息状态",
      span: 24,
      prop: "status",
      type: "select",
      searchValue: "ALL",
      dicData: [
        { label: "全部", value: "ALL" },
        { label: "已发送", value: "ALREADY_SEND" },
        { label: "待发送", value: "WAIT_SEND" },
        { label: "取消发送", value: "CANCEL_SEND" },
      ],
      search: true,
      addDisplay: false,
      editDisplay: false,
    },
    {
      label: "是否推送",
      span: 24,
      type: "radio",
      dicData: [
        { label: "推送", value: true },
        { label: "不推送", value: false },
      ],
      value: true,
      prop: "isSend",
      hide: true,
      showColumn: false,
      searchWidth: "100",
    },
    {
      label: "推送时间",
      span: 24,
      type: "radio",
      dicData: [
        { label: "立即推送", value: "NOW" },
        { label: "定时推送", value: "TIME" },
      ],
      hide: true,
      showColumn: false,
      value: "NOW",
      prop: "sendWay",
      searchWidth: "100",
    },
    {
      label: "推送时间",
      span: 24,
      type: "datetime",
      prop: "sendTime",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      placeholder: "请选择推送时间",
      rules: [
        {
          required: true,
          message: "推送时间不能为空",
        },
        { validator: verificationTime, trigger: "blur" },
      ],
      search: true,
      addDisplay: false,
      editDisplay: false,
    },
  ],
};