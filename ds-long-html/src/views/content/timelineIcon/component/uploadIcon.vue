<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类名称" prop="iconClassifyId">
        <el-select
          v-model="ruleForm.iconClassifyId"
          placeholder="请选择视频分类"
          clearable
          :disabled="row.id ? true : false"
        >
          <el-option
            v-for="item in optClass"
            :key="item.id"
            :value="item.id"
            :label="item.iconClassifyName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ICON名称" prop="iconName" style="width: 80%">
        <el-input
          v-model="ruleForm.iconName"
          clearable
          maxLength="10"
          placeholder="请输入ICON名称（10字以内）"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div>
          <upload
            bucketType="GAME_CNETER"
            accept="image/png"
            @onChange="handleChange"
            :W2HRate="1 / 1"
            :maxFileSize="5"
            :limit="1000"
            :multiple="true"
            :fileList="iconlist"
            :isW2HRateTip="false"
            :W2HRateOrigin="{
              width: 1,
              height: 1,
            }"
          />
          <span>请上传image/png 格式的文件,最大5MB,宽高比为1:1</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  iconDetailSaveIconDetail,
  iconDetailUpdateIconDetail,
} from "@/api/admin/index";
import upload from "@/components/upload/index.vue";
import { debounceCallBack } from "@/util/util";
import { iconClassifyPageList } from "@/api/admin/index";

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
      ruleForm: {
        iconClassifyId: "",
        iconImg: [],
        iconBucket: "",
        iconImg: [],
        iconName: "",
      },
      optClass: [],
      iconlist: [],
      rules: {
        iconClassifyId: [
          { required: true, message: "请选择分类名称", trigger: "blur" },
        ],
        iconName: [
          { required: true, message: "请输入ICON名称", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    iconClassifyPageList({
      current: 1,
      size: 999,
    }).then((res) => {
      this.optClass = res.data.data.records;
      if (this.row.id) {
        this.getInfo();
      }
    });
  },
  methods: {
    handleChange(data) {
      if (data.length) {
        this.ruleForm.iconImg = data.map((item) => item.key);
        this.ruleForm.iconBucket = data[0].bucketName;
      } else {
        this.ruleForm.iconImg = [];
      }
    },
    getInfo() {
      this.ruleForm.iconClassifyId = this.row.id;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!this.ruleForm.iconImg.length) {
          return this.$message.error("请上传ICON");
        }
        if (valid) {
          const comSubmit = () => {
            const params = {
              ...this.ruleForm,
            };
            return iconDetailSaveIconDetail(params).then(() => {
              this.$message.success("保存成功");
              this.row.callback(true);
              Promise.resolve();
            });
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
  },
};
</script>
