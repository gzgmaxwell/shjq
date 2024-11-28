<template>
  <div>
    <!-- 2.28日 v4.2.2需求删除 -->
    <!-- <div class="tostStyle">
      <i class="el-icon-warning" style="color: #e6a23c"></i>
      请直接上传来源于分销系统获取的安装包
    </div> -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="官方版本号" prop="versionOfficial">
        <el-input
          style="width: 65%"
          v-model="ruleForm.versionOfficial"
          placeholder="请输入官方版本号"
          clearable
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-select
          style="width: 65%"
          v-model="ruleForm.platform"
          placeholder="请选择平台"
          disabled
        >
          <el-option
            v-for="item in optionsVersionType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否强制更新" prop="forceUpdate">
        <el-radio-group
          v-model="ruleForm.forceUpdate"
          placeholder="请选择是否强制更新"
        >
          <el-radio
            v-for="item in optionsVersionUpdate"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推送时间" prop="pushTime">
        <el-date-picker
          style="width: 65%"
          v-model="ruleForm.pushTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          popper-class="hide-time"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            },
          }"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="全量包" prop="apkFileName">
        <upload
          bucketType="FILE"
          accept=".apk,.ipa"
          listType="text"
          ref="uploadRef"
          @onChangeFile="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          :fileList="fileList"
          uploadFrom="singleVideo"
        />
        <ul class="upload-progress" v-if="loading">
          <el-progress :stroke-width="5" :percentage="percentage" />
        </ul>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>更新内容</span>
        <wangEditor
          :row="paramsRow"
          :height="150"
          :menus="[
            'head',
            'bold',
            'fontSize',
            'fontName',
            'italic',
            'underline',
            'link',
            'foreColor',
            'backColor',
          ]"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verificationTime } from "@/util/validate.js";
import AppInfoParser from "app-info-parser";
import { addObj, putObj } from "@/api/admin/version";
import upload from "@/components/upload/index.vue";
import wangEditor from "@/components/wangEditor/index.vue";
import {
  debounceCallBack,
  optionsVersionType,
  optionsVersionUpdate,
  ENUM_VERSIONUPDATE_STATUS,
  EnumVERSIONTYPE,
} from "@/util/util";
let strLenConfig = 500;
export default {
  components: {
    upload,
    wangEditor,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      optionsVersionType: optionsVersionType,
      optionsVersionUpdate: optionsVersionUpdate,
      fileList: [],
      strLen: 0,
      paramsRow: {
        onChange: (event) => {
          const html = event.txt.html();
          this.ruleForm.updateContent = html;
          this.strLen = event.txt.text().length;
        },
        htmlContent: "",
      },
      loading: false,
      percentage: 0,
      ruleForm: {
        version: "",
        versionOfficial: "",
        platform: "",
        forceUpdate: ENUM_VERSIONUPDATE_STATUS.yes,
        pushTime: "",
        updateContent: "",
        apkFileName: "",
        apkBucketName: "",
      },
      rules: {
        forceUpdate: [
          {
            required: true,
            message: "请选择是否强制更新",
            trigger: "blur",
          },
        ],
        updateContent: [
          {
            required: true,
            message: "请输入更新内容",
            trigger: "blur",
          },
        ],
        pushTime: [
          {
            required: true,
            message: "请选择推送时间",
          },
          { validator: verificationTime, trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    onChangeFile(fileList) {
      this.loading = true;
      const uploadRef = this.$refs.uploadRef;
      if (fileList === "del") {
        uploadRef.clearFiles();
        this.loading = false;
        this.percentage = 0;
        this.ruleForm.apkFileName = "";
        this.ruleForm.versionOfficial = "";
        this.ruleForm.platform = "";
        return;
      }
      const parser = new AppInfoParser(fileList.file);
      parser
        .parse()
        .then((res) => {
          //打印获取所需apk文件信息
          if (res.versionName) {
            this.ruleForm.versionOfficial = res.versionName;
          } else {
            this.ruleForm.versionOfficial = res.CFBundleShortVersionString;
          }
        })
        .catch((err) => {});

      uploadRef.sureBtnUpload(
        (data) => {
          let fileExtension = data.name.substring(data.name.lastIndexOf("."));
          if (fileExtension != ".ipa") {
            this.ruleForm.platform = EnumVERSIONTYPE.android;
          } else {
            this.ruleForm.platform = EnumVERSIONTYPE.ios;
          }
          this.ruleForm.apkFileName = data.key;
          this.ruleForm.apkBucketName = data.bucketName;
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          this.percentage = progress;
        }
      );
    },
    getRow() {
      this.ruleForm = {
        version: this.row.version,
        versionOfficial: this.row.versionOfficial,
        platform: this.row.platform,
        pushTime: this.row.pushTime,
        forceUpdate: this.row.forceUpdate,
        updateContent: this.row.updateContent,
        apkFileName: this.row.apkFileName,
        id: this.row.id,
      };
      this.fileList = [{ url: this.row.apkUrl, name: this.row.apkFileName }];
      if (this.row.updateContent) {
        this.paramsRow.htmlContent = this.row.updateContent;
      }
    },
    comSubmit(apiFunc) {
      return apiFunc(this.ruleForm).then(() => {
        const successMsg = this.row.id ? "编辑成功" : "新增成功";
        this.$message.success(successMsg);
        this.row.callback(true);
        return Promise.resolve();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.strLen > strLenConfig) {
          return this.$message.warning(`更新内容最大长度为${strLenConfig}`);
        }
        if (valid) {
          if (!this.ruleForm.apkFileName) {
            return this.$message.warning("请上传全量包");
          }
          if (!this.row.id) {
            debounceCallBack(() => this.comSubmit(addObj))();
          } else {
            debounceCallBack(() => this.comSubmit(putObj))();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-progress {
  margin: 0;
  padding: 0;
}
::v-deep .el-upload-dragger {
  width: 175%;
}
</style>
