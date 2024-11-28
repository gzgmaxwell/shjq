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
        </el-col>
        <el-col :span="10">
          <el-form-item label="包名" required>
            <el-input
              v-model="packageName"
              type="textarea"
              disabled
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
  </div>
</template>
<script>
import {
  package_save,
  package_EnableVersion,
  package_record,
} from "@/api/admin";
import { debounce, optPackage } from "@/util/util";
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
      optPackageList: [],
      packageName: "",
      ruleForm: {
        appName: "",
        backgroundBucketName: "",
        backgroundFile: "",
        foregroundBucketName: "",
        foregroundFile: "",
        startupBucketName: "",
        startupFile: "",
        systemVersionFieldId: [],
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
        systemVersionFieldId: [
          { required: true, message: "请选择安装包", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    package_EnableVersion({ platform: "ANDROID" }).then((res) => {
      this.optPackageList = res.data.data;
      this.getInfo();
    });
  },
  methods: {
    getPackageName() {
      const selectedItems =
        this.ruleForm?.systemVersionFieldId?.map((id) =>
          this.optPackageList.find((item) => item.id === id)
        ) || [];
      this.packageName = selectedItems
        .map((item) => item.packageName)
        .join("\n");
    },
    handleChange() {
      this.getPackageName();
    },
    getInfo() {
      package_record().then((res) => {
        const list = res.data.data;
        this.ruleForm = list;
        this.ruleForm.appName = list.appName;
        this.ruleForm.backgroundBucketName = list.backgroundBucketName;
        this.ruleForm.backgroundFile = list.backgroundFile;
        this.ruleForm.foregroundBucketName = list.foregroundBucketName;
        this.ruleForm.foregroundFile = list.foregroundFile;
        this.ruleForm.startupBucketName = list.startupBucketName;
        this.ruleForm.startupFile = list.startupFile;
        if (list.systemVersionFieldId) {
          this.ruleForm.systemVersionFieldId = list.systemVersionFieldId;
          this.getPackageName();
        }
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
      if (!this.row.id) {
        package_save(params).then(() => {
          this.row.callback(true);
          this.$message.success("正在生成中...");
        });
      }
    },
  },
};
</script>
