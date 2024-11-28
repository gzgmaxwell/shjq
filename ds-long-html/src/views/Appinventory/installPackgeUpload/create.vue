<template>
  <div>
    <div class="tostStyle">
      <i class="el-icon-warning" style="color: #e6a23c"></i>
      请直接上传安装包
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="所属项目" prop="projectName">
        <el-select v-model="ruleForm.projectName" style="width: 65%">
          <!-- @change="handleProjectChange" -->
          <el-option
            v-for="item in options"
            :key="item.dictionaryValue"
            :label="item.dictionaryKey"
            :value="item.dictionaryValue"
            clearable
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作系统">
        <el-select
          v-model="ruleForm.appSystemName"
          placeholder="请选择系统"
          style="width: 65%"
          disabled
        >
          <!-- @change="handleSystemChange" -->
          <!-- <el-option
          v-for="item in systemOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          clearable
        >
        </el-option> -->
          <el-option
            v-for="item in optionsVersionType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本">
        <!-- <el-select
        v-model="ruleForm.appVersion"
        placeholder="请选择版本"
        style="width: 65%"
        filterable
        allow-create
      >
        <el-option
          v-for="item in appVersionOptions"
          :key="item.id"
          :label="item.appVersion"
          :value="item.appVersion"
          clearable
        >
        </el-option>
      </el-select> -->
        <el-input
          style="width: 65%"
          v-model="ruleForm.appVersion"
          placeholder="请输入版本号"
          clearable
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="上传">
        <upload
          bucketType="FILE"
          accept=".apk,.ipa"
          listType="text"
          ref="uploadRef"
          @onChangeFile="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="10"
          title="上传安装包"
          :fileList="fileList"
          uploadFrom="singleVideo"
        />
        <ul class="upload-progress" v-if="loading">
          <el-progress :stroke-width="5" :percentage="percentage" />
        </ul>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import AppInfoParser from "app-info-parser";
import {
  debounceCallBack,
  optionsVersionType,
  ENUM_DIC_TYPE,
  EnumVERSIONTYPE,
} from "@/util/util";
import { mapGetters } from "vuex";
import { getVersionByProjectName, saveProjectPackage } from "@/api/admin/index";
import upload from "@/components/upload/index.vue";
export default {
  components: {
    upload,
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
      optionsVersionType: optionsVersionType,
      // selectedProject: "",
      // selectedSystem: "",
      percentage: 0,
      loading: false,
      fileList: [],
      ruleForm: {
        id: "",
        projectName: "",
        appSystemName: "",
        appVersion: "",
        packageFile: "",
        packageBucketName: "",
      },
      options: [],
      // appVersionOptions: [],
      // systemOptions: [
      //   {
      //     value: "ios",
      //     label: "ios",
      //   },
      //   {
      //     value: "android",
      //     label: "android",
      //   },
      // ],
      rules: {
        projectName: [
          { required: true, message: "请选择项目", trigger: "blur" },
        ],
        // appSystemName: [
        //   { required: true, message: "请选择系统", trigger: "blur" },
        // ],
        // appVersion: [
        //   { required: true, message: "请填写版本号", trigger: "blur" },
        // ],
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
    // isSelectionComplete() {
    //   return this.selectedProject !== "" && this.selectedSystem !== "";
    // },
  },
  mounted() {
    this.options = this.dictionary[ENUM_DIC_TYPE.package];
  },

  methods: {
    onChangeFile(fileList) {
      this.loading = true;
      const uploadRef = this.$refs.uploadRef;
      if (fileList === "del") {
        uploadRef.clearFiles();
        this.loading = false;
        this.percentage = 0;
        this.ruleForm.packageFile = "";
        this.ruleForm.appSystemName = "";
        this.ruleForm.appVersion = "";
        return;
      }
      const parser = new AppInfoParser(fileList.file);
      parser
        .parse()
        .then((res) => {
          // console.log(res);
          //打印获取所需apk文件信息
          if (res.versionName) {
            this.ruleForm.appVersion = res.versionName;
          } else {
            this.ruleForm.appVersion = res.CFBundleShortVersionString;
          }
        })
        .catch((err) => {});
      uploadRef.sureBtnUpload(
        (data) => {
          let fileExtension = data.name.substring(data.name.lastIndexOf("."));
          if (fileExtension != ".ipa") {
            this.ruleForm.appSystemName = EnumVERSIONTYPE.android;
          } else {
            this.ruleForm.appSystemName = EnumVERSIONTYPE.ios;
          }
          this.ruleForm.packageFile = data.key;
          this.ruleForm.packageBucketName = data.bucketName;
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          this.percentage = progress;
        }
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.packageFile) {
            return this.$message.warning("请上传安装包");
          }
          this.commit();
        }
      });
    },
    commit() {
      const comSubmit = () => {
        return saveProjectPackage(this.ruleForm).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("新增成功");
            this.row.callback(true);
            return Promise.resolve();
          }
        });
      };
      debounceCallBack(comSubmit)();
    },
    // handleProjectChange(value) {
    //   this.selectedProject = value;
    //   this.queryData();
    // },
    // handleSystemChange(value) {
    //   this.selectedSystem = value;
    //   this.queryData();
    // },
    // queryData() {
    //   if (this.isSelectionComplete) {
    //     const params = {
    //       appSystemName: this.selectedSystem,
    //       projectName: this.selectedProject,
    //     };
    //     getVersionByProjectName(params).then((res) => {
    //       const { data } = res;
    //       if (data.code == 200) {
    //         this.appVersionOptions = data.data;
    //         this.appVersionOptions.forEach((v) => {
    //           this.ruleForm.appVersion = v.appVersion;
    //         });
    //       }
    //     });
    //   }
    // },
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
