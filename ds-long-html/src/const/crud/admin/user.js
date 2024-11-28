import { checkUsernameType } from "@/util/validate.js";
import { getDetails } from "@/api/admin/user";
import { i18nTranLabel } from "@/util/util";

const validateUsername = (rule, value, callback) => {
  var reg = new RegExp("^[A-Za-z0-9]+$");
  if (!value) {
    return callback(new Error("请输入用户名"));
  }
  if (!reg.test(value)) {
    return callback(new Error("请输入数字和英文！"));
  }
  getDetails(value).then((response) => {
    if (window.boxType === "edit") callback();
    let result = response.data.data;
    if (result !== null) {
      callback(new Error("用户名已经存在"));
    } else {
      callback();
    }
  });
};

// 设置密码校验规则
const checkPassword = (rule, value, callback) => {
  if (window.boxType === "edit") {
    return callback();
  }
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error("密码长度应在6-20位以内"));
  } else {
    callback();
  }
};

const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入联系方式"));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的电话"));
    }
  }
};

export const userRules = {
  password: [{ required: true, validator: checkPassword, trigger: "change" }],
  qrpassword: [],
  role: [
    {
      required: true,
      message: "请选择角色",
      trigger: "blur",
    },
  ],
};

export const tableOption = {
  border: true,
  index: true,
  indexLabel: i18nTranLabel('edit'), // 序号
  stripe: true,
  menuAlign: "center",
  searchMenuSpan: 6,
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  selection: true,
  refreshBtn: false,
  emptyBtnText: "重置",
  menuWidth: 150,
  column: [
    {
      fixed: true,
      label: "id",
      prop: "userId",
      span: 24,
      hide: true,
      editDisplay: false,
      addDisplay: false,
    },
    {
      fixed: true,
      label: "用户名",
      prop: "username",
      slot: true,
      search: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "请输入用户名",
        },
        {
          min: 3,
          max: 20,
          message: "长度在 3 到 20 个字符",
          trigger: "blur",
        },
        { validator: validateUsername, trigger: "blur" },
      ],
    },
    {
      fixed: true,
      label: "真实姓名",
      prop: "realName",
      slot: true,
      search: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "请输入真实姓名",
        },
        {
          min: 1,
          max: 10,
          message: "长度在 1 到 10 个字符",
          trigger: "blur",
        },
        { validator: checkUsernameType, trigger: "blur" },
      ],
    },
    {
      label: "手机号",
      prop: "phone",
      value: "",
      search: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "手机号不能为空",
          trigger: "blur",
        },
        {
          validator: checkPhone,
          trigger: "blur",
        },
      ],
    },
    {
      label: "密码",
      prop: "password",
      type: "password",
      value: "",
      editDisplay: false,
      showColumn: false,
      hide: true,
      span: 24,
      autocomplete: "new-password",
      rules: [{ required: true, validator: checkPassword, trigger: "blur" }],
    },
    {
      label: "确认密码",
      prop: "qrpassword",
      type: "password",
      editDisplay: false,
      showColumn: false,
      value: "",
      hide: true,
      span: 24,
      rules: [],
    },
    {
      label: "角色",
      prop: "role",
      overHidden: true,
      searchMultiple: true,
      search: true,
      type: "select",
      multiple: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "请选择角色",
          trigger: "blur",
        },
      ],
      dicData: [],
      props: {
        label: "roleName",
        value: "roleId",
      },
    },
    {
      label: "平台",
      prop: "busPlatformIds",
      overHidden: true,
      searchMultiple: true,
      search: false,
      type: "select",
      multiple: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "请选择平台",
          trigger: "blur",
        },
      ],
      dicData: [],
      props: {
        label: "platformName",
        value: "id",
      },
    },
    {
      width: 140,
      sortable: true,
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      editDisabled: true,
      addDisplay: false,
      span: 24,
    },
  ],
};
