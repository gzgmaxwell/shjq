<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="选择账号" prop="userId">
        <el-select v-model="ruleForm.userId" placeholder="请选择账号">
          <el-option
            v-for="item in userAllData"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { userAll } from "@/api/admin/index";
import { assignUser } from "@/api/video-manage/await-examine";
import { debounceCallBack } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      userAllData: [],
      ruleForm: {
        userId: "",
      },
      rules: {
        userId: [{ required: true, message: "请选择账号", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.getUserAll();
  },
  methods: {
    getUserAll() {
      const params = {
        onlyOnlineStatus: true,
      };
      userAll(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.userAllData = data.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.row.id,
            ...this.ruleForm,
          };
          const comSubmit = () => {
            return assignUser(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("分配成功");
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

<style lang="sass" scoped></style>
