<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item :label="$t('icon')" prop="iconFileName">
        <div>
          <upload
            bucketType="PRE_VIDEO"
            @onChange="handleChangeImg"
            list-type="picture-card"
            fileType="img"
            :imgLimit="imgLimit"
            :fileList="fileList"
          />
        </div>
      </el-form-item> -->
      <el-form-item label="figma命名" prop="figmaKey">
        <el-input
          v-model="ruleForm.figmaKey"
          placeholder="请输入figma命名"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('feature_name')" prop="moduleName">
        <el-input
          v-model="ruleForm.moduleName"
          :placeholder="`${this.$t('please_enter')} ${this.$t('feature_name')}`"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('affiliation_module')" prop="moduleName">
        <el-select
          v-model="ruleForm.moduleType"
          :placeholder="`${this.$t('please_select')} ${this.$t(
            'affiliation_module'
          )}`"
        >
          <el-option
            v-for="item in optionsModuleType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sort')" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          :placeholder="`${this.$t('please_enter')} ${this.$t('sort')}`"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+0)}"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('routing_path')" prop="routePath">
        <el-input
          v-model="ruleForm.routePath"
          :placeholder="`${this.$t('please_enter')} ${this.$t('routing_path')}`"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio
            v-for="item in optionStatus"
            :key="item.id"
            :label="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("determine")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { optionsModuleType, optionStatus, EnumStatus } from "@/util/util";
import { restore, additional } from "@/api/Appinventory/courses";
import upload from "@/components/upload/index.vue";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    upload,
  },
  data() {
    return {
      optionsModuleType: optionsModuleType,
      optionStatus: optionStatus,
      ruleForm: {
        id: "",
        figmaKey: "",
        moduleName: "",
        moduleType: "",
        // iconFileName: "",
        sort: "",
        routePath: "",
        status: EnumStatus.ON,
        // iconBucketName: "PUBLIC",
      },
      imgLimit: 1,
      // fileList: [],
      rules: {
        figmaKey: [
          {
            required: true,
            message: `请输入figma命名`,
            trigger: "blur",
          },
        ],
        moduleName: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("feature_name")}`,
            trigger: "blur",
          },
        ],
        moduleType: [
          {
            required: true,
            message: `${this.$t("please_select")} ${this.$t(
              "affiliation_module"
            )}`,
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("sort")}`,
            trigger: "blur",
          },
        ],
        routePath: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("routing_path")}`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    // handleChangeImg(data) {
    //   if (data && data.length) {
    //     this.ruleForm.iconFileName = data[0].key;
    //   } else {
    //     this.ruleForm.iconFileName = "";
    //   }
    // },
    getRow() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.moduleName = this.row.moduleName;
      this.ruleForm.moduleType = this.row.moduleType;
      // this.ruleForm.iconFileName = this.row.iconFileName;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.routePath = this.row.routePath;
      this.ruleForm.status = this.row.status;
      this.ruleForm.figmaKey = this.row.figmaKey;
      // if (this.row.iconFileUrl) {
      //   this.fileList = [{ url: this.row.iconFileUrl }];
      // } else {
      //   this.fileList = [];
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (!this.ruleForm.iconFileName) {
          //   return this.$message.error(this.$t("please_upload_pictures"));
          // }
          if (!this.ruleForm.id) {
            additional(this.ruleForm).then((res) => {
              if (res.data.code == "200") {
                this.$message.success(this.$t("successfully_added"));
                this.row.callback(true);
              }
            });
          } else {
            restore(this.ruleForm).then(() => {
              this.$message.success(this.$t("successfully_edited"));
              this.row.callback(true);
            });
          }
        } else {
          this.$message.error(this.$t("verification_failed"));
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
