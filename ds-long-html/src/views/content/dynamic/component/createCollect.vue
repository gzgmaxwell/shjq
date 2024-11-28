<template>
  <div class="mt20">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="合集名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入活动标题"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>合集封面:</span>

        <upload
          bucketType="AD"
          accept="image/png,image/jpg,image/jpeg"
          @onChange="handleChange"
          :W2HRate="16 / 9"
          :maxFileSize="10"
          :limit="1"
          title="上传"
          :fileList="fileList"
          :isW2HRateTip="false"
        />
        请上传image/png,image/jpg, image/jpeg 格式的文件,10mb以内的文件
      </el-form-item>

      <el-form-item label="封面背景色:">
        <span slot="label"><span class="must">*</span>封面背景色:</span>
        <el-color-picker
          v-model="form.backgroundColor"
          :show-alpha="true"
          :predefine="predefineColors"
          color-format="rgb"
        />
      </el-form-item>

      <el-form-item label="排序:" prop="sort">
        <el-input-number
          :min="1"
          :max="99999999999999"
          :step="1"
          v-model="form.sort"
          placeholder="请输入排序"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="sureBtn('form')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "@/components/upload/index.vue";
import { collectionsSaveOrUpdate } from "@/api/content/index";
import tinycolor from "tinycolor2";

export default {
  components: {
    upload,
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        name: "",
        coverFileName: "",
        coverBucketName: "",
        backgroundColor: "rgba(173,173,173,1)",
        sort: "",
      },
      predefineColors: [
        "rgba(133,150,167, 1)",
        "rgba(155,162,185, 1)",
        "rgba(212,201,178, 1)",
        "rgba(193,184,165, 1)",
        "rgba(169,182,165, 1)",

        "rgba(191,199,210, 1)",
        "rgba(173,175,178, 1)",
        "rgba(175,178,193, 1)",
        "rgba(208,198,213, 1)",
        "rgba(224,226,226, 1)",

        "rgba(220,211,215, 1)",
        "rgba(136,140,153, 1)",
        "rgba(200,198,175, 1)",
        "rgba(190,197,213, 1)",
        "rgba(226,223,215, 1)",

        "rgba(210,211,207, 1)",
        "rgba(218,205,206, 1)",
        "rgba(190,187,172, 1)",
        "rgba(168,159,145, 1)",
        "rgba(214,213,214, 1)",
      ],
      fileList: [], //图片上传之后显示数据
      rules: {
        name: [{ required: true, message: "请输入合集名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    // 编辑活动数据
    getInfo() {
      this.form.name = this.row.name;
      this.fileList = [{ url: this.row.coverFileUrl }];
      this.form.coverFileName = this.row.coverFileName;
      this.form.coverBucketName = this.row.coverBucketName;
      this.form.sort = this.row.sort;
      this.form.backgroundColor = `rgba(${this.row.backgroundColor})`;
    },
    handleChange(data) {
      if (data.length) {
        this.form.coverFileName = data[0].key;
        this.form.coverBucketName = data[0].bucketName;
      } else {
        this.form.coverFileName = "";
      }
    },

    sureBtn(formName) {
      if (!this.form.coverFileName) {
        return this.$message.error("请上传合集封面");
      }
      if (!this.form.backgroundColor) {
        return this.$message.error("请选择封面背景色");
      }
      const colorMatch = this.form.backgroundColor.match(/(\d+(\.\d+)?)/g);

      const params = {
        ...this.form,
        backgroundColor: colorMatch.toString(),
        id: this.row.id,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          collectionsSaveOrUpdate(params).then(() => {
            this.$message.success("新增成功");
            this.row.callback(true);
          });
        }
      });
    },
  },
};
</script>
