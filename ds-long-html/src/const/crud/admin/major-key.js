import { checkUsernameTypeEN } from '@/util/validate.js'

export const majorKeyOptions = {
  align: "center",
  menuAlign: "center",
  searchMenuSpan: 6,
  border: true,
  addBtnText: "新建",
  viewBtn: true,
  refreshBtn:false,
  emptyBtnText:'重置',
  column: [
    {
      label: "主键",
      prop: "id",
      span: 24,
      labelWidth: "120",
      addDisplay: false,
      editDisplay: false,
    },
    {
      label: "业务标识符",
      prop: "bizTag",
      search: true,
      span: 24,
      searchLabelWidth: "90",
      labelWidth: "120",
      editDisabled:true,
      rules:[{
        required: true,
        message: '请输入业务标识符'
      },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        },{ validator: checkUsernameTypeEN,trigger: 'blur'}]
    },
    {
      label: "ID数值(起始点)",
      prop: "maxId",
      type:'number',
      controls:false,
      minRows:1,
      span: 24,
      labelWidth: "120",
      precision:0,
      rules:[{
        required: true,
        message: '请输入ID数值',
        trigger: 'blur'
      }]
    },
    {
      label: "步长(范围)",
      prop: "step",
      type:'number',
      controls:false,
      minRows:1,
      span: 24,
      labelWidth: "120",
      rules:[{
        required: true,
        message: '请输入步长(范围)'
      },]
    },
    {
      label: "描述",
      prop: "description",
      span: 24,
      labelWidth: "120",
      rules:[{
        required: true,
        message: '请输入描述'
      },]
    },
    {
      label: "创建时间",
      prop: "createTime",
      addDisplay: false,
      sortable:true,
      span: 24,
      labelWidth: "120",
      editDisplay: false,
    },
    {
      label: "更新时间",
      prop: "updateTime",
      addDisplay: false,
      sortable:true,
      span: 24,
      labelWidth: "120",
      editDisplay: false,
    },
  ],
}
