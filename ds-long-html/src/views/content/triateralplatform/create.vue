<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="渠道名称：" prop="channelName">
      <el-input
        onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
        placeholder="请输入渠道名称，只能输入字母"
        v-model="ruleForm.channelName"
        clearable
        :disabled="row.id ? true : false"
        maxlength="20"
        show-word-limit
      >
      </el-input>
    </el-form-item>

    <el-form-item label="上传权限目录：" prop="channelPath">
      <el-input
        onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
        placeholder="请输入上传权限目录，只能输入字母"
        v-model="ruleForm.channelPath"
      >
      </el-input>
    </el-form-item>

    <el-form-item label="渠道密钥key：" prop="secretKey">
      <el-input
        onkeyup="this.value=this.value.replace(/[^\x00-\xffa-zA-Z0-9]/g,'')"
        placeholder="请输入渠道密钥key"
        v-model="ruleForm.secretKey"
        type="textarea"
        maxlength="16"
        show-word-limit
      >
      </el-input>
    </el-form-item>

    <el-form-item label="状态：" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio
          :label="item.id"
          v-for="item in optionTriaStatus"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  saveVideoGatherChannel,
  updateVideoGatherChannel,
} from "@/api/content/index";
import { optionTriaStatus, ENUM_TRIA_STATUS } from "@/util/util";
import { getAuthorName } from "@/api/authorName/index";

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
        channelName: "",
        channelPath: "",
        secretKey: "",
        status: ENUM_TRIA_STATUS.open,
        userId: "",
      },
      optionUserId: [],
      optionTriaStatus: optionTriaStatus,
      rules: {
        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
        ],
        channelPath: [
          {
            required: true,
            message: "请输入上传权限目录",
            trigger: "blur",
          },
        ],
        secretKey: [
          {
            required: true,
            message: "请输入渠道密钥key",
            trigger: "blur",
          },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: "不能包含中文字符",
            trigger: "blur",
          },
          {
            required: true,
            max: 16,
            min: 16,
            message: "长度必须为16位",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "广告状态",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.ruleForm.channelName = this.row.channelName;
      this.ruleForm.channelPath = this.row.channelPath;
      this.ruleForm.secretKey = this.row.secretKey;
      this.ruleForm.status = this.row.status;
      this.ruleForm.userId = this.row.userId;
    }
    this.authorName();
  },

  methods: {
    remoteMethod(query) {
      this.loading = true;
      this.authorName(query);
    },
    authorName(query = "") {
      getAuthorName({ nickName: query }).then((res) => {
        this.loading = false;
        this.optionUserId = res.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },

    commit() {
      const params = {
        id: this.row.id,
        ...this.ruleForm,
      };
      if (this.row.id) {
        updateVideoGatherChannel(params).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      } else {
        saveVideoGatherChannel(params).then(() => {
          this.$message.success("新增成功");
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
