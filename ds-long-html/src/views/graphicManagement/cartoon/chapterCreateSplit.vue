<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <span slot="label"><span class="must">*</span>源文件:</span>
        <upload
          listType="text"
          bucketType="INK_LORE"
          :accept="pageConfig.accept"
          @onChange="onChangeEffect"
          :limit="pageConfig.limit"
          :multiple="true"
          :fileList="fileListEffect"
          :maxFileSize="pageConfig.maxFileSize"
          :isEncodingUtf8="pageConfig.isEncodingUtf8"
        />
        <span>{{ pageConfig.tip }}</span>
      </el-form-item>
      <el-form-item label="作品名称:">
        <el-input
          style="width: 70%"
          v-model="this.row.name"
          placeholder="请输入作品名称"
          disabled
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="章节生成符" prop="code">
        <el-select
          v-model="ruleForm.split"
          placeholder="请选择章节生成符"
          clearable
        >
          <el-option
            v-for="item in optCode"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button
          type="primary"
          :disabled="loading"
          @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveEntire } from "@/api/graphicManagement";
import upload from "@/components/upload/index.vue";
import {
  debounceCallBack,
  optCartoonType,
  optSplitCode,
} from "@/util/util";

export default {
  components: {
    upload,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      fileListEffect: [],
      loading: true,
      pageConfig: optCartoonType.find((v) => v.id == this.$route.query?.type),
      optCode: optSplitCode,
      ruleForm: {
        code: this.$route.query?.code,
        contentBucket: "",
        contentFile: "",
      },
      rules: {
        split: [
          { required: true, message: "请输入章节生成符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onChangeEffect(data) {
      if (data.length) {
        this.ruleForm.contentFile = data[0].key;
        this.ruleForm.contentBucket = data[0].bucketName;
        this.loading = false;
      } else {
        this.ruleForm.contentFile = "";
        this.loading = true;
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.contentFile) {
            return this.$message.error("请上传源文件");
          }
          const comSubmit = () => {
            return saveEntire(this.ruleForm).then(() => {
              this.$message.success("新增成功");
              this.row.callback(true);
              return Promise.resolve();
            });
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
  },
};
</script>
