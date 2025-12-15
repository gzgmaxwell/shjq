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
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { workUser } from "@/api/graphicManagement/index";
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
        workContent: "INK_LORE_CONTENT_EXAMINE",
      };
      workUser(params).then((res) => {
        this.userAllData = res.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.row.callback({ id: this.row.id, ...this.ruleForm });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped></style>
