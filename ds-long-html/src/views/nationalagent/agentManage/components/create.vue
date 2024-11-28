<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户类型">
        <el-radio-group v-model="userType">
          <el-radio
            @change="
              () => {
                ruleForm.userId = '';
              }
            "
            v-for="item in optUserType"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择用户" prop="userId">
        <el-select
          v-model="ruleForm.userId"
          remote
          filterable
          clearable
          reserve-keyword
          placeholder="请选择用户"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="(result, i) in optionAuthor"
            :key="i"
            :value="result.id"
            :label="userType == 'name' ? result.nickName : result.id"
            :disabled="result.status !== 'ENABLE'"
          >
            <span style="float: left">{{
              userType == "name" ? result.nickName : result.id
            }}</span>
            <span style="float: right" class="must">{{
              compLabel(result)
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: right; margin-left: -120px">
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dsUserList } from "@/api/userList";
import {
  debounceCallBack,
  AuthorStatus,
  ENUM_USER_STATUS,
  optUserType,
  EnumUserType,
} from "@/util/util";
import { saveUserAgent } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionAuthor: [],
      userType: EnumUserType.name,
      optUserType: optUserType,
      ruleForm: {
        userId: "",
      },
      rules: {
        userId: [{ required: true, message: "请选择用户", trigger: "change" }],
      },
    };
  },
  computed: {
    compLabel() {
      return (val) => {
        const item = AuthorStatus.filter(
          (item) => item.id !== ENUM_USER_STATUS.enable
        ).find((v) => v.id === val.status);
        return item?.name;
      };
    },
  },
  mounted() {
    this.getAuthorName();
  },
  methods: {
    //用户列表的接口
    async getAuthorName() {
      const params = {
        current: 1,
        size: 20,
      };
      let { data: res } = await dsUserList(params);
      this.optionAuthor = res.data.records;
    },
    async remoteMethod(query) {
      if (query) {
        const params = {
          current: 1,
          size: 20,
        };
        if (this.userType === EnumUserType.name) {
          params.nickName = query;
        }
        if (this.userType === EnumUserType.id) {
          params.userId = query;
        }
        let { data: res } = await dsUserList(params);
        this.optionAuthor = res.data.records.filter((item) => {
          return (
            item.nickName.indexOf(query) > -1 || item.id.indexOf(query) > -1
          );
        });
      } else {
        this.getAuthorName();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
          };
          const comSubmit = () => {
            return saveUserAgent(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
                Promise.resolve();
              }
            });
          };
          debounceCallBack(comSubmit)();
        } else {
          return false;
        }
      });
    },
  },
};
</script>
