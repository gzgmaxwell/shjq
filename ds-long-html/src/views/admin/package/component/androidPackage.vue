<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="应用名称" prop="appName">
        <el-input
          style="width: 55%"
          placeholder="请输入应用名称（安装后显示在app图标下面）"
          v-model="ruleForm.appName"
        />
      </el-form-item>

      <el-form-item>
        <span slot="label"><span class="must">*</span>应用图标</span>
        <div>
          <upload
            bucketType="AD"
            accept="image/png,image/jpg,image/jpeg"
            :W2HRate="1 / 1"
            :W2HRateOrigin="{ width: 1, height: 1 }"
            :maxFileSize="4"
            title="上传前景图"
            @onChange="handleChangeImgFront"
            :limit="1"
            :fileList="imgFileListFront"
            :isW2HRateTip="false"
          />
          <span style="margin-top: -10px">
            请上传尺寸为1:1,png/jpg 4M 以内的图片；推荐为192*192 px 的图片</span
          >
        </div>
      </el-form-item>
      <el-form-item>
        <div>
          <upload
            bucketType="AD"
            accept="image/png,image/jpg,image/jpeg"
            :W2HRate="1 / 1"
            :W2HRateOrigin="{ width: 1, height: 1 }"
            :maxFileSize="4"
            title="上传后景图"
            @onChange="handleChangeImgAfter"
            :limit="1"
            :fileList="imgFileListAfter"
            :isW2HRateTip="false"
          />
          <span style="margin-top: -10px">
            请上传尺寸为1:1,png/jpg 4M 以内的图片；推荐为192*192 px 的图片</span
          >
        </div>
      </el-form-item>

      <el-form-item>
        <span slot="label"><span class="must">*</span>启动页logo</span>
        <div>
          <upload
            bucketType="AD"
            accept="image/png,image/jpg,image/jpeg"
            :W2HRate="1 / 1"
            :W2HRateOrigin="{ width: 1, height: 1 }"
            :maxFileSize="4"
            @onChange="handleChangeImgLogo"
            :limit="1"
            :fileList="imgFileListLogo"
            :isW2HRateTip="false"
          />
          <span style="margin-top: -10px">
            请上传尺寸为1:1, png/jpg 4M 以内的图片</span
          >
        </div>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选择风格" prop="versionStyleId">
            <el-select
              v-model="ruleForm.versionStyleId"
              clearable
              @change="getStyleChange"
            >
              <el-option
                v-for="item in optVersionStyleId"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-button type="primary" @click="handleAdd" class="ml10"
              >预览</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <!-- <el-col :span="12">
          <el-form-item label="选择安装包" prop="systemVersionFieldId">
            <el-select
              v-model="ruleForm.systemVersionFieldId"
              clearable
              multiple
              @change="handleChange"
            >
              <el-option
                v-for="item in optPackageList"
                :key="item.id"
                :label="'短视频 ' + item.versionOfficial"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="10">
          <el-form-item label="包名" required>
            <el-input
              v-model="packageNamebusPlatformId"
              type="textarea"
              disabled
              :autosize="{ minRows: 1, maxRows: 2 }"
              resize="none"
            >
            </el-input
          ></el-form-item>
        </el-col> -->
        <el-col :span="10">
          <el-form-item label="包名" prop="packageName">
            <el-input
              v-model="ruleForm.packageName"
              type="textarea"
              onkeyup="value=value.replace(/[^\w.]/g,'');"
              :autosize="{ minRows: 1, maxRows: 2 }"
              resize="none"
            >
            </el-input
          ></el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">关闭</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="预览图片"
      :visible.sync="visible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <theme :row="rowParams" v-if="visible" />
    </el-dialog>
  </div>
</template>
<script>
import {
  package_EnableVersion,
  // package_record,
  tenantGetInfo,
  versionStyle_page,
  saveStyleConfig,
  updateStyleConfig,
} from "@/api/admin";
import { debounce, EnumVERSIONTYPE, optionsVersionUpdate } from "@/util/util";
import upload from "@/components/upload/index.vue";
import theme from "./theme.vue";

export default {
  components: {
    upload,
    theme,
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
      optionsVersionUpdate: optionsVersionUpdate,
      // optPackageList: [],
      optVersionStyleId: [],
      // packageName: "",
      // packageNamebusPlatformId: "",
      // versionStyleDetailId: "",
      visible: false,
      rowParams: {},
      ruleForm: {
        id: "",
        appName: "",
        backgroundBucketName: "",
        backgroundFile: "",
        foregroundBucketName: "",
        foregroundFile: "",
        startupBucketName: "",
        startupFile: "",
        versionStyleId: "",
        // systemVersionFieldId: [],
        packageName: "",
      },
      imgFileListFront: [],
      imgFileListAfter: [],
      imgFileListLogo: [],
      rules: {
        appName: [
          {
            required: true,
            message: "请输入应用名称（安装后显示在app图标下面）",
            trigger: "blur",
          },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
          {
            pattern: /^[^\s]*$/,
            message: "应用名称不能包含空格",
            trigger: "blur",
          },
        ],
        // systemVersionFieldId: [
        //   {
        //     required: true,
        //     message: "请选择安装包",
        //     trigger: "change",
        //   },
        // ],
        versionStyleId: [
          {
            required: true,
            message: "请选择风格",
            trigger: "change",
          },
        ],
        packageName: [
          {
            required: true,
            message: "请输入包名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    versionStyle_page({
      current: 1,
      size: 999,
    })
      .then((res) => {
        const enableData = res.data.data.records.filter(
          (v) => v.status === true
        );
        this.optVersionStyleId = enableData;
      })
      .catch((error) => {})
      .finally(() => {
        this.getInfo();
      });
  },
  methods: {
    handleAdd() {
      this.visible = true;
      this.rowParams = {
        callback: (data) => {
          if (data) {
            this.getList();
          }
          this.visible = false;
        },
      };
    },
    //选择安装包后获取包名
    // getPackageName() {
    //   const selectedItems =
    //     this.ruleForm?.systemVersionFieldId?.map((id) =>
    //       this.optPackageList.find((item) => item.id === id)
    //     ) || [];
    //   this.packageName = selectedItems[0].packageName;
    //   this.packageNamebusPlatformId =
    //     selectedItems[0].packageName + selectedItems[0].busPlatformId;
    //   this.versionStyleDetailId = selectedItems[0].versionStyleDetailId;
    // },

    // handleChange() {
    //   this.getPackageName();
    // },
    // 选择风格后获取安装包
    getStyleChange(val) {
      // this.ruleForm.systemVersionFieldId = [];
      // this.packageNamebusPlatformId = "";
      // if (val) {
      //   this.getPackage_EnableVersion({
      //     versionStyleId: val,
      //     platform: EnumVERSIONTYPE.android,
      //   });
      // }
    },
    // 获取安装包
    getPackage_EnableVersion(params) {
      package_EnableVersion(params).then((res) => {
        this.optPackageList = res.data.data;
      });
    },
    getInfo() {
      tenantGetInfo(EnumVERSIONTYPE.android).then((res) => {
        const list = res.data.data || {};
        this.ruleForm.id = list.id;
        this.ruleForm.appName = list.appName;
        this.ruleForm.backgroundBucketName = list.backgroundBucketName;
        this.ruleForm.backgroundFile = list.backgroundFile;
        this.ruleForm.foregroundBucketName = list.foregroundBucketName;
        this.ruleForm.foregroundFile = list.foregroundFile;
        this.ruleForm.startupBucketName = list.startupBucketName;
        this.ruleForm.startupFile = list.startupFile;
        this.ruleForm.packageName = list.packageName;
        // if (list.systemVersionFieldId) {
        //   this.ruleForm.systemVersionFieldId = list.systemVersionFieldId;
        //   // this.getPackageName();
        // }
        const versionStyleId = this.optVersionStyleId.find(
          (v) => v.id === list.versionStyleId
        );
        this.ruleForm.versionStyleId = versionStyleId ? versionStyleId.id : "";
        if (list.foregroundUrl) {
          this.imgFileListFront = [{ url: list.foregroundUrl }];
        }
        if (list.backgroundUrl) {
          this.imgFileListAfter = [{ url: list.backgroundUrl }];
        }
        if (list.startupUrl) {
          this.imgFileListLogo = [{ url: list.startupUrl }];
        }
      });
    },

    handleChangeImgFront(data) {
      if (data.length) {
        this.ruleForm.foregroundFile = data[0].key;
        this.ruleForm.foregroundBucketName = data[0].bucketName;
      } else {
        this.ruleForm.foregroundFile = "";
        this.ruleForm.foregroundBucketName = "";
      }
    },
    handleChangeImgAfter(data) {
      if (data.length) {
        this.ruleForm.backgroundFile = data[0].key;
        this.ruleForm.backgroundBucketName = data[0].bucketName;
      } else {
        this.ruleForm.backgroundFile = "";
        this.ruleForm.backgroundBucketName = "";
      }
    },
    handleChangeImgLogo(data) {
      if (data.length) {
        this.ruleForm.startupFile = data[0].key;
        this.ruleForm.startupBucketName = data[0].bucketName;
      } else {
        this.ruleForm.startupFile = "";
        this.ruleForm.startupBucketName = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debounce(this.commit, 400)();
        }
      });
    },

    commit() {
      const params = {
        ...this.ruleForm,
        platform: EnumVERSIONTYPE.android,
        // versionStyleDetailId: this.versionStyleDetailId,
      };
      if (!this.ruleForm.foregroundFile) {
        return this.$message.warning("请上传前景图");
      }
      if (!this.ruleForm.backgroundFile) {
        return this.$message.warning("请上传后景图");
      }
      if (!this.ruleForm.startupFile) {
        return this.$message.warning("启动页logo");
      }

      if (!this.ruleForm.id) {
        saveStyleConfig(params).then(() => {
          this.row.callback(true);
          this.$message.success("配置成功");
        });
      } else {
        updateStyleConfig(params).then(() => {
          this.row.callback(true);
          this.$message.success("修改成功");
        });
      }

      // package_save(params).then(() => {
      //   this.row.callback(true);
      //   this.$message.success("正在生成中...");
      // });
    },
  },
};
</script>
