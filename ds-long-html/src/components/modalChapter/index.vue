<template>
  <el-dialog
    :title="row.id ? '编辑' : '新增'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :before-close="handleClose"
    width="30%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item v-if="contentList">
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
          v-model="form.name"
          placeholder="请输入作品名称"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="章节标题:" prop="title">
        <el-input
          style="width: 70%"
          v-model="form.title"
          placeholder="请输入章节标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="章节序号:" prop="sort">
        <el-input-number
          style="width: 70%"
          :min="1"
          :max="999999999999"
          :step="1"
          v-model="form.sort"
          placeholder="请输入章节序号"
        ></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="handing"
          @click="submit('submit')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { chapterSaveOrUpdate, chapter_preview } from "@/api/graphicManagement";
import upload from "@/components/upload/index.vue";
import { debounceCallBack, EnumCartoonType, optCartoonType } from "@/util/util";

export default {
  components: {
    upload,
  },
  data() {
    return {
      visible: false,
      contentList: false,
      query: null,
      API: chapterSaveOrUpdate,
      API_preview: chapter_preview,
      row: {},
      fileListEffect: [],
      loading: true,
      handing: false,
      pageConfig: [],
      form: {
        name: "",
        title: "",
        sort: "",
        contentList: [],
        inkLoreCode: "",
      },
      rules: {
        name: [{ required: true, message: "请输入作品名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入章节标题", trigger: "blur" }],
        sort: [{ required: true, message: "请输入章节序号", trigger: "blur" }],
      },
    };
  },
  methods: {
    init() {
      this.form.name = this.query.name;
      this.form.inkLoreCode = this.query.code;
      this.pageConfig = optCartoonType.find((v) => v.id == this.query?.type);
      if (this.row?.id) {
        this.form.title = this.row.title;
        this.form.sort = this.row.sort;
        this.loading = false;
        this.API_preview({ chapterId: this.row.id }).then((res) => {
          this.form.contentList = res.data.data;
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
    onChangeEffect(data) {
      this.loading = true;
      if (data.length) {
        this.form.contentList = data.map((item) => {
          let name = String(item.name || "");
          let sortName = "";
          if (name.includes(".")) {
            sortName = name.split(".").slice(0, -1).join(".");
          } else {
            sortName = name;
          }
          if (this.query?.type === EnumCartoonType.novel) {
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
        if (allUploaded || this.query?.type === EnumCartoonType.novel) {
          this.loading = false;
        }
      } else {
        this.form.contentList = [];
      }
    },

    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (
            this.form.contentList &&
            this.form.contentList.length == 0 &&
            this.contentList
          ) {
            return this.$message.error("请上传图片示例");
          }
          let params = {
            ...this.form,
          };
          if (this.row.id) {
            params = {
              id: this.row.id,
              ...this.form,
            };
          }
          const successMsg = this.row.id ? "编辑成功" : "新增成功";

          const comSubmit = () => {
            this.handing = true;
            return this.API(params)
              .then(() => {
                this.handing = false;
                this.$message.success(successMsg);
                this.row.callback({
                  form: params,
                  handleClose: this.handleClose,
                });
                return Promise.resolve();
              })
              .catch(() => {
                this.handing = false;
              });
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
    handleChange(data) {
      if (data.length) {
        this.form.coverImageFile = data[0].key;
        this.form.coverImageBucket = data[0].bucketName;
      } else {
        this.fileList = [];
        this.form.coverImageFile = "";
      }
    },

    handleClose() {
      this.visible = false;
      this.fileListEffect = [];
      this.form.contentList = [];
      this.API = chapterSaveOrUpdate;
      this.API_preview = chapter_preview;
      this.resetForm();
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
