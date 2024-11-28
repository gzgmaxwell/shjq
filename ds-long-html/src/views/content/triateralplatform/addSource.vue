<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="名称" :rules="[{ required: true }]">
      <div v-for="(item, index) in ruleForm.sourceList" :key="index">
        <el-input
          v-model="item.channelSource"
          style="width: 70%; margin-bottom: 10px"
          placeholder="请输入要添加的来源"
          maxlength="10"
          show-word-limit
          clearable
          :disabled="item.id ? true : false"
        ></el-input>
        <i
          class="el-icon-circle-plus btn"
          @click="addSource"
          v-if="index === ruleForm.sourceList.length - 1"
        ></i>
        <i
          class="el-icon-remove btn"
          @click.prevent="removeSource(index)"
          v-if="index > 0"
        ></i>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { sourceList, saveSource } from "@/api/content/index";
import { debounce } from "@/util/util";
export default {
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
      loading: false,
      ruleForm: {
        sourceList: [{ channelSource: "" }],
      },
    };
  },

  mounted() {
    this.getSourceList();
  },

  methods: {
    getSourceList() {
      const channelId = this.row.id;
      sourceList(channelId).then((res) => {
        const { data } = res;
        this.ruleForm.sourceList = data.data || this.ruleForm.sourceList;
      });
    },
    removeSource(index) {
      this.ruleForm.sourceList.splice(index, 1);
    },
    addSource() {
      this.ruleForm.sourceList.push({
        channelSource: "",
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const hasEmptyRatio = this.ruleForm.sourceList.some(
          (item) => !item.channelSource
        );
        if (hasEmptyRatio) {
          this.$message.error("来源名称不能为空");
          return false;
        }
        if (valid) {
          debounce(this.commit, 400)();
        }
      });
    },

    commit() {
      const params = {
        channelId: this.row.id,
        createUserId: this.$store.getters.userInfo.id,
        ...this.ruleForm,
      };
      saveSource(params).then(() => {
        this.$message.success("操作成功");
        this.row.callback(true);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
