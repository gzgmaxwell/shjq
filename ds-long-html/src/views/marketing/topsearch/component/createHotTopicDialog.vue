<template>
  <el-dialog
    :title="row.substanceTopicId ? '编辑' : '新建'"
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
      <el-form-item label="话题: " prop="topicName">
        <el-autocomplete
          placeholder="请输入话题"
          @select="handleSelect"
          :fetch-suggestions="querySearchAsync"
          v-model="ruleForm.topicName"
          :disabled="row.substanceTopicId != null"
        />
      </el-form-item>

      <el-form-item label="话题详情: " prop="topicContent">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入备注（5-100字符）"
          v-model="ruleForm.topicContent"
          resize="none"
          minlength="5"
          maxlength="100"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number
          :min="1"
          :step="1"
          step-strictly
          v-model="ruleForm.sort"
        />
      </el-form-item>

      <el-form-item label="状态：" prop="open">
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
  substanceHotTopicSave,
  substanceHotTopicUpdate,
} from "@/api/marketing/topsearch";
import { substanceTopicPage } from "@/api/marketing/topic-store";
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
    var checkTopicName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入话题"));
      }
      const str = value.replaceAll("#", "");
      if (str.length > 10 || str.length < 2) {
        callback(new Error("话题2-10个字符,不包含开通“#”符号"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        substanceTopicId: "",
        topicName: "",
        topicContent: "",
        sort: 1,
        status: 1,
      },
      optionStatus: optionStatus,
      rules: {
        topicName: [{ validator: checkTopicName, trigger: "change" }],
        topicContent: [
          { required: true, message: "请输入话题详情", trigger: "blur" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入排序(值越大排名越靠前)",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
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
      if (this.row.substanceTopicId) {
        this.getInfo();
      } else {
        this.ruleForm.substanceTopicId = "";
        this.ruleForm.topicName = "";
        this.ruleForm.topicContent = "";
        this.ruleForm.sort = 1;
        this.ruleForm.status = 1;
      }
    },

    querySearchAsync(queryString, cb) {
      const params = {
        current: 1,
        size: 999,
        topicName: queryString, //视频名称
      };
      substanceTopicPage(params).then((res) => {
        const { data } = res;
        data.data.records.forEach((v) => {
          v.value = v.topicName;
        });
        cb(data.data.records);
      });
    },
    handleSelect(item) {
      this.ruleForm.substanceTopicId = item.id;
    },
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.substanceTopicId = this.row.substanceTopicId;
      this.ruleForm.topicName = this.row.topicName;
      this.ruleForm.topicContent = this.row.topicContent;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.initSort = this.row.sort;
      this.ruleForm.status = this.row.status;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
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
      if (!this.row.substanceTopicId) {
        substanceHotTopicSave(params).then(() => {
          this.$emit("onChange", true);
          this.handleClose();
          this.$message.success("新增成功");
        });
      } else {
        substanceHotTopicUpdate(params).then(() => {
          this.$emit("onChange", true);
          this.handleClose();
          this.$message.success("编辑成功");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
