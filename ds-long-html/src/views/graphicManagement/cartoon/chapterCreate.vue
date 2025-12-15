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
          :isNumberFileName="pageConfig.isNumberFileName"
          :isEncodingUtf8="pageConfig.isEncodingUtf8"
        />
        <span>{{ pageConfig.tip }}</span>
      </el-form-item>

      <el-form-item label="作品名称:" prop="name">
        <el-input
          style="width: 70%"
          v-model="ruleForm.name"
          placeholder="请输入作品名称"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="章节标题:" prop="title">
        <el-input
          style="width: 70%"
          v-model="ruleForm.title"
          placeholder="请输入章节标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="章节序号:" prop="sort">
        <el-input-number
          style="width: 70%"
          :min="1"
          :max="999999999999"
          :step="1"
          v-model="ruleForm.sort"
          placeholder="请输入章节序号"
        ></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="handing"
          @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { chapterSaveOrUpdate, chapter_preview } from "@/api/graphicManagement";
import upload from "@/components/upload/index.vue";
import { debounceCallBack, EnumCartoonType, optCartoonType } from "@/util/util";

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
      handing: false,
      pageConfig: optCartoonType.find((v) => v.id == this.$route.query?.type),
      ruleForm: {
        name: this.row.name,
        title: "",
        sort: "",
        contentList: [],
        inkLoreCode: this.row.inkLoreCode,
      },
      rules: {
        name: [{ required: true, message: "请输入作品名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入章节标题", trigger: "blur" }],
        sort: [{ required: true, message: "请输入章节序号", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.ruleForm.name = this.row.name;
      this.ruleForm.title = this.row.title;
      this.ruleForm.sort = this.row.sort;
      this.loading = false;
      chapter_preview({ chapterId: this.row.id }).then((res) => {
        this.ruleForm.contentList = res.data.data;
        this.fileListEffect = res.data.data.map((item) => {
          return {
            name: item.sort,
            url: item.contentUrl,
            key: item.contentFile,
            bucketName: item.contentBucket,
            imageWidth: item.width,
            imageHeight: item.height,
            isUploadFinish: true,
            wordCount: item.wordCount,
          };
        });
      });
    }
  },
  methods: {
    onChangeEffect(data) {
      this.loading = true;
      if (data.length) {
        this.ruleForm.contentList = data.map((item) => {
          let name = String(item.name || "");
          let sortName = "";
          if (name.includes(".")) {
            sortName = name.split(".").slice(0, -1).join(".");
          } else {
            sortName = name;
          }
          if (this.$route.query?.type === EnumCartoonType.novel) {
            sortName = 1;
          }
          return {
            contentFile: item.key,
            contentBucket: item.bucketName,
            sort: sortName,
            width: item.imageWidth,
            height: item.imageHeight,
            wordCount: item.length,
          };
        });
        const allUploaded = data.at(-1).isUploadFinish;
        if (allUploaded || this.$route.query?.type === EnumCartoonType.novel) {
          this.loading = false;
        }
      } else {
        this.ruleForm.contentList = [];
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.ruleForm.contentList &&
            this.ruleForm.contentList.length == 0
          ) {
            return this.$message.error("请上传图片示例");
          }
          let params = {
            ...this.ruleForm,
          };
          if (this.row.id) {
            params = {
              id: this.row.id,
              ...this.ruleForm,
            };
          }
          const successMsg = this.row.id ? "编辑成功" : "新增成功";

          const comSubmit = () => {
            this.handing = true;
            return chapterSaveOrUpdate(params).then(() => {
              this.handing = false;
              this.$message.success(successMsg);
              this.row.callback(true);
              return Promise.resolve();
            }).catch(()=>{
              this.handing = false;
            });
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
