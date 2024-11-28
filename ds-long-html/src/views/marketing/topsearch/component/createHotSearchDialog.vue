<template>
  <el-dialog
    :title="row.id ? '编辑' : '新建'"
    :visible="dialogVisible"
    :before-close="handleClose"
    @open="open"
    width="40%"
    :close-on-click-modal="false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="热搜内容: " prop="hotSearchName">
        <el-input
          placeholder="请输入热搜内容"
          v-model="ruleForm.hotSearchName"
        />
      </el-form-item>

      <el-form-item label="热搜排序：" prop="sort">
        <el-input-number
          placeholder="请输入排序(值越大排名越靠前)"
          :min="1"
          :step="1"
          step-strictly
          v-model="ruleForm.sort"
        />
        <span class="sortTip">*值越大排名越靠前</span>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="item.id" v-for="item in optionStatus" :key="item.id"
            >{{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="handleClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  hotSearchSave,
  ListByTopicName,
  hotSearchUpdate,
} from "@/api/marketing/topsearch";
import { optionStatus } from "@/util/util";
export default {
  props: {
    onChange: {
      type: Function,
      required: false,
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
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
        id: "",
        hotSearchName: "",
        sort: 1,
        topicIds: [],
        status: 0,
      },
      options: [],
      optionStatus: optionStatus,
      rules: {
        hotSearchName: [
          { required: true, message: "请输入热搜内容", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        topicIds: [{ required: true, message: "关联话题", trigger: "change" }],
        status: [
          {
            required: true,
            message: "状态",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("update:dialogVisible", false);
    },
    open() {
      this.getTopicList();
    },
    getTopicList() {
      ListByTopicName(null).then((res) => {
        const { data } = res;
        this.options = data.data;
        if (this.row.id) {
          this.getInfo();
        } else {
          this.ruleForm.id = "";
          this.ruleForm.hotSearchName = "";
          this.ruleForm.topicContent = "";
          this.ruleForm.sort = "";
          this.ruleForm.initSort = "";
          this.ruleForm.topicIds = [];
          this.ruleForm.status = 0;
        }
      });
    },
    getInfo() {
      const topicIds =
        this.row.relativeTopics && this.row.relativeTopics.map((v) => v.id);
      this.ruleForm.id = this.row.id;
      this.ruleForm.hotSearchName = this.row.hotSearchName;
      this.ruleForm.topicContent = this.row.topicContent;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.initSort = this.row.sort;
      this.ruleForm.topicIds = topicIds || [];
      this.ruleForm.status = this.row.status;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    commit() {
      const params = {
        ...this.ruleForm,
      };
      if (params.initSort && params.initSort == params.sort) {
        delete params.sort;
      }
      if (this.ruleForm.id === "") {
        hotSearchSave(params).then(() => {
          this.$emit("onChange", true);
          this.handleClose();
          this.$message.success("新增成功");
        });
      } else {
        hotSearchUpdate(params).then(() => {
          this.$emit("onChange", true);
          this.handleClose();
          this.$message.success("新增成功");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sortTip {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
</style>
