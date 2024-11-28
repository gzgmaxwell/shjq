<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <span v-if="nextStep">
      <el-form-item :label="$t('user_name')" prop="username">
        <el-input
          :placeholder="$t('user_name')"
          :disabled="row.userId && row.authenticatorStatus"
          v-model="ruleForm.username"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('real_name')" prop="realName">
        <el-input
          :placeholder="$t('real_name')"
          v-model="ruleForm.realName"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('phone')" prop="phone">
        <el-input
          :placeholder="$t('phone')"
          v-model="ruleForm.phone"
          autocomplete="off"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('password')" prop="password" v-if="!row.userId">
        <el-input
          :placeholder="`${$t('the_length_should_be')}${$t('6-20')}${$t(
            'within_bits'
          )}`"
          autocomplete="new-password"
          v-model="ruleForm.password"
          type="password"
          clearable
        />
      </el-form-item>

      <el-form-item
        :label="$t('confirm_password')"
        v-if="!row.userId"
        prop="qrpassword"
      >
        <el-input
          :placeholder="$t('confirm_password')"
          v-model="ruleForm.qrpassword"
          type="password"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('role')" prop="role">
        <el-cascader
          style="width: 100%"
          :options="rolesOptions"
          clearable
          v-model="ruleForm.role"
          :placeholder="$t('role')"
          :props="{
            value: 'roleId',
            label: 'roleName',
            checkStrictly: true,
            multiple: true,
          }"
        ></el-cascader>
        <!-- <el-select
          v-model="ruleForm.role"
          style="width: 100%"
          :placeholder="$t('role')"
          multiple
          clearable
        >
          <el-option
            v-for="(item, index) in rolesOptions"
            :key="index"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select> -->
      </el-form-item>
      <!-- 4.3.9删除 -->
      <!-- <el-form-item :label="$t('platform')" prop="busPlatformIds">
        <el-select
          v-model="ruleForm.busPlatformIds"
          style="width: 100%"
          :placeholder="$t('platform')"
          multiple
          clearable
        >
          <el-option
            v-for="(item, index) in platformOptions"
            :key="index"
            :label="item.platformName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="ruleForm.deptId"
          placeholder="请选择部门"
          clearable
          :options="department"
          :props="{
            label: 'name',
            value: 'id',
            checkStrictly: true,
          }"
          filterable
        ></el-cascader>
      </el-form-item>

      <el-form-item :label="$t('认证状态')" v-if="row.userId">
        <span>{{
          compuAuthenticatorStatus(ruleForm.authenticatorStatus)
        }}</span>
      </el-form-item>
      <el-form-item v-if="!row.authenticatorStatus && row.userId">
        <span class="priBtn" @click="handleAuth">去完成安全认证</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          row.userId ? $t("determine") : $t("next_step")
        }}</el-button>
        <el-button @click="row.callback && row.callback()">{{
          $t("cancel")
        }}</el-button>
      </el-form-item>
    </span>
    <span v-if="!nextStep">
      <bindGoogleAuth :row="infoParams" />
    </span>
  </el-form>
</template>
<script>
import { addObj, putObj } from "@/api/admin/user";
import { platformListByUser } from "@/api/admin/index";
import { roleTree } from "@/api/admin/role";
import { i18nATL, optionsAuthenticator, findPath } from "@/util/util";

import { checkUsernameType } from "@/util/validate.js";
import { getDetails } from "@/api/admin/user";
import { mapGetters } from "vuex";
import bindGoogleAuth from "@/views/common/bindGoogleAuth";

const validateUsername = (rule, value, callback, row) => {
  var reg = new RegExp("^[A-Za-z0-9]+$");
  if (!value) {
    return callback(
      new Error(`${i18nATL(["please_enter"])}${i18nATL(["user_name"])}`)
    );
  }
  if (!reg.test(value)) {
    return callback(
      new Error(
        `${i18nATL(["please_enter"])}${i18nATL(["numbers_and_english"])}`
      )
    );
  }
  getDetails(value).then((response) => {
    const { data } = response;
    if (!data.data) {
      callback();
    }
    if (row.userId) {
      if (
        row.userId == data.data.userId &&
        row.username === data.data.username
      ) {
        callback();
      }
      if (
        row.userId !== data.data.userId &&
        row.username === data.data.username
      ) {
        callback(new Error(`${i18nATL(["user_name"])}${i18nATL(["existed"])}`));
      }
    }
    if (window.boxType === "edit") callback();
    let result = response.data.data;
    if (result !== null) {
      callback(new Error(`${i18nATL(["user_name"])}${i18nATL(["existed"])}`));
    } else {
      callback();
    }
  });
};

// 设置密码校验规则
const checkPassword = (rule, value, callback) => {
  if (!value) {
    callback(
      new Error(`${i18nATL(["please_enter"])} ${i18nATL(["password"])}`)
    );
  } else if (value.length < 6 || value.length > 20) {
    callback(
      new Error(i18nATL(["the_length_should_be", "6-20", "within_bits"]))
    );
  } else {
    callback();
  }
};

const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18nATL(["please_enter", "contact_info"])));
  } else {
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(
        new Error(i18nATL(["please_enter", "correct", "telephone"]))
      );
    }
  }
};

export default {
  components: {
    bindGoogleAuth,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ruleForm: {
        username: "",
        realName: "",
        phone: "",
        password: "",
        qrpassword: "",
        role: [],
        // busPlatformIds: [],
        authenticatorStatus: false,
        deptId: [],
      },
      nextStep: true,
      rolesOptions: [],
      platformOptions: [],
      infoParams: {
        userId: "",
        username: "",
        callback: (data) => this.row.callback(data),
      },
      rules: {
        username: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("user_name")}`,
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: i18nATL(["the_length_should_be", "3-20", "within_bits"]),
            trigger: "blur",
          },
          {
            validator: (val, data, callback) => {
              validateUsername(val, data, callback, this.row);
            },
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            message: i18nATL(["please_enter", "real_name"]),
          },
          {
            min: 1,
            max: 10,
            message: i18nATL(["the_length_should_be", "1-10", "within_bits"]),
            trigger: "blur",
          },
          { validator: checkUsernameType, trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("phone")}`,
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        password: [
          { required: true, validator: checkPassword, trigger: "blur" },
        ],
        qrpassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
        ],
        role: [
          {
            required: true,
            message: `${this.$t("please_select")}${this.$t("role")}`,
            trigger: "blur",
          },
        ],
        // 4.3.9删除
        // busPlatformIds: [
        //   {
        //     required: true,
        //     message: `${this.$t("please_select")}${this.$t("platform")}`,
        //     trigger: "blur",
        //   },
        // ],
        deptId: [
          {
            required: true,
            message: `请选择部门`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getNodeData();
  },
  computed: {
    compuAuthenticatorStatus() {
      return (authenticatorStatus) => {
        const item = optionsAuthenticator.find(
          (v) => v.id === authenticatorStatus
        );
        return item.name;
      };
    },
    ...mapGetters({
      department: "department",
    }),
  },

  methods: {
    getNodeData() {
      const params = {
        current: 1,
        size: 99999,
      };
      roleTree(params).then((res) => {
        this.rolesOptions = res.data.data;
        if (this.row.userId) {
          this.infoParams.userId = this.row.userId;
          this.infoParams.username = this.row.username;
          this.getInfo();
        }
      });
      platformListByUser().then((response) => {
        this.platformOptions = response.data.data;
      });
    },
    getInfo() {
      this.ruleForm.username = this.row.username;
      this.ruleForm.realName = this.row.realName;
      this.ruleForm.phone = this.row.phone;
      // 4.3.9删除
      // this.ruleForm.busPlatformIds =
      //   this.row.platformList?.map((v) => v.id) || [];
      this.ruleForm.authenticatorStatus = this.row.authenticatorStatus;
      const deptId = findPath(
        this.department,
        this.row.deptId,
        "id",
        "children"
      );
      this.ruleForm.deptId = deptId;

      const arr = [];
      (this.row.roleList.map((v) => v.roleId) || []).forEach((v) => {
        const myArr = findPath(this.rolesOptions, v, "id", "children");
        arr.push(myArr);
      });
      this.ruleForm.role = arr;
    },
    handleAuth() {
      this.nextStep = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      const role = [];
      const arr = [...this.ruleForm.role];
      arr.forEach((v) => {
        if (v.length) {
          role.push(v.pop());
        }
      });
      const params = {
        ...this.ruleForm,
        userId: this.row.userId,
        deptId: this.ruleForm.deptId[this.ruleForm.deptId.length - 1],
        role,
      };
      if (!this.row.userId) {
        if (this.ruleForm.password !== this.ruleForm.qrpassword) {
          return this.$message.warning(this.$t("the_two_passwords_not_match"));
        }
        addObj(params).then((res) => {
          this.nextStep = false;
          this.infoParams.userId = res.data.data.userId;
          this.infoParams.username = res.data.data.username;
          this.$notify.success(this.$t("successfully_added"));
        });
      } else {
        putObj(params).then(() => {
          this.$notify.success(this.$t("successfully_edited"));
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
