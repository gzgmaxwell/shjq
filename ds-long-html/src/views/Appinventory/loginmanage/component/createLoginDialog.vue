<template>
  <el-dialog
    :title="row.id ? '编辑' : '新建'"
    :visible="dialogVisible"
    :before-close="handleClose"
    @open="open"
    destroy-on-close
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
      <el-form-item>
        <span slot="label"><span class="must">*</span>图片上传：</span>
        <upload
          bucketType="AD"
          @onChange="handleChangeImg"
          :maxFileSize="10"
          :W2HRate="9 / 16"
          fileType="img"
          :imgLimit="imgLimit"
          :fileList="ruleForm.imgFileList"
        />
      </el-form-item>

      <el-form-item label="展示时间：" prop="dateTime">
        <el-date-picker
          v-model="ruleForm.dateTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接地址:" prop="jumpAddress">
        <el-input
          placeholder="请输入链接地址"
          v-model="ruleForm.jumpAddress"
          resize="none"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="权重：" prop="weight">
        <el-input-number
          placeholder="请输入权重(大于0的整数)"
          :min="1"
          :max="100"
          :step="1"
          step-strictly
          v-model="ruleForm.weight"
        />
      </el-form-item>

      <el-form-item label="备注: ">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入备注（0-50字符）"
          v-model="ruleForm.remark"
          resize="none"
          maxlength="50"
          show-word-limit
        >
        </el-input>
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
import { appLoginsave, appLoginUpdate } from "@/api/Appinventory/enter";
import upload from "@/components/upload/index";
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
  components: {
    upload,
  },
  data() {
    return {
      imgLimit: 1,
      ruleForm: {
        id: "",
        weight: 1,
        loginFormat: "0",
        imgFileList: [],
        remark: "",
        dateTime: [],
        status: 0,
        jumpAddress: "",
        coverFileName: "",
        coverBucketName: "",
      },
      options: [], //排序等级循环项
      optionAdPos: [], //排序等级循环项
      rules: {
        weight: [{ required: true, message: "权重", trigger: "blur" }],
        dateTime: [{ required: true, message: "选择日期", trigger: "change" }],
        locationId: [
          { required: true, message: "广告位：", trigger: "change" },
        ],
        status: [
          {
            required: true,
            message: "广告状态",
            trigger: "change",
          },
        ],
        jumpAddress: [
          { required: false, message: "跳转地址", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    handleClose() {
      this.restData();
      this.$refs["ruleForm"].resetFields();
      this.$emit("update:dialogVisible", false);
    },
    open() {
      if (this.row.id) {
        this.getInfo();
      } else {
        this.restData();
      }
    },
    handleChangeImg(data) {
      if (data.length) {
        this.ruleForm.coverFileName = data[0].key;
        this.ruleForm.coverBucketName = data[0].bucketName;
      } else {
        this.ruleForm.coverFileName = "";
        this.ruleForm.coverBucketName = "";
      }
    },
    restData() {
      this.ruleForm.id = "";
      this.ruleForm.weight = 1;
      this.ruleForm.loginFormat = "0";
      this.ruleForm.imgFileList = [];
      this.ruleForm.remark = "";
      this.ruleForm.dateTime = [];
      this.ruleForm.status = 0;
      this.ruleForm.jumpAddress = "";
      this.ruleForm.coverFileName = "";
      this.ruleForm.coverBucketName = "";
    },
    // 回显广告信息
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.loginFormat = this.row.loginFormat;
      this.ruleForm.remark = this.row.remark;
      this.ruleForm.weight = this.row.weight;
      this.ruleForm.status = this.row.status;
      this.ruleForm.jumpAddress = this.row.jumpAddress;
      this.ruleForm.dateTime = [this.row.startTime, this.row.endTime];
      this.ruleForm.coverFileName = this.row.coverFileName;
      this.ruleForm.coverBucketName = this.row.coverBucketName;
      if (this.row.coverFileUrl) {
        this.ruleForm.imgFileList = [
          {
            url: this.row.coverFileUrl,
            key: this.row.coverFileName,
            bucketName: this.row.coverBucketName,
          },
        ];
      }
    },
    // 新建广告位/修改广告
    submitForm(formName) {
      if (!this.ruleForm.coverFileName) {
        return this.$message.warning("请上传图片");
      }
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
      let startTime = "";
      let endTime = "";
      if (this.ruleForm.dateTime && this.ruleForm.dateTime.length) {
        startTime = this.ruleForm.dateTime[0];
        endTime = this.ruleForm.dateTime[1];
      }
      //广告格式
      const params = {
        id: this.ruleForm.id,
        weight: Number(this.ruleForm.weight),
        loginFormat: this.ruleForm.loginFormat,
        remark: this.ruleForm.remark,
        status: this.ruleForm.status,
        jumpAddress: this.ruleForm.jumpAddress,
        startTime,
        endTime,
        coverFileName: this.ruleForm.coverFileName,
        coverBucketName: this.ruleForm.coverBucketName,
      };
      if (!this.ruleForm.id) {
        appLoginsave(params).then(() => {
          this.$emit("onChange", true);
          this.handleClose();
          this.$message.success("新增成功");
        });
      } else {
        appLoginUpdate(params).then(() => {
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
