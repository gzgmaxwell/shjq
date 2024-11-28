<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="级别" prop="agentLevel">
        <el-input
          v-model="ruleForm.agentLevel"
          placeholder="请输入级别"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="代理名称" prop="agentName">
        <el-input
          v-model="ruleForm.agentName"
          placeholder="请输入代理名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="分成比例" prop="agentRatio">
        <el-input
          v-model="ruleForm.agentRatio"
          placeholder="请输入分成比例"
          clearable
        >
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="上传图标" prop="levelImg">
        <div>
          <upload
            bucketType="GAME_CNETER"
            accept="image/png;image/jpeg"
            @onChange="handleChangeCover"
            :W2HRate="1 / 1"
            :maxFileSize="20"
            :limit="1"
            :fileList="fileList"
            :isW2HRateTip="false"
            :W2HRateOrigin="{
              width: 1,
              height: 1,
            }"
          />
          <span>请上传image/png,image/jpg 格式的文件,最大20MB,宽高比为1:1</span>
        </div>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "@/components/upload/index.vue";
import { optionsShowStyle, EnumShowStyle, debounceCallBack } from "@/util/util";
import { saveScheme, updateScheme } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  components: {
    upload,
  },
  data() {
    return {
      ruleForm: {
        createUserId: this.$store.getters.userInfo.id,
        agentLevel: "",
        agentName: "",
        agentRatio: "",
        levelImg: "",
      },
      fileList: [],
      rules: {
        agentLevel: [
          { required: true, message: "级别不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        agentName: [
          { required: true, message: "请输入代理名称", trigger: "blur" },
        ],
        agentRatio: [
          { required: true, message: "请输入分成比例", trigger: "blur" },
          {
            pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
            message: "请输入正确的分成比例,最大不能超过100,最多两位小数",
            trigger: "blur",
          },
        ],
        levelImg: [{ required: true, message: "请上传图标", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    handleChangeCover(data) {
      console.log(data);
      if (data.length) {
        this.ruleForm.levelImg = data[0].key;
        this.ruleForm.levelImgBucket = data[0].bucketName;
      } else {
        this.ruleForm.levelImg = "";
      }
    },
    getRow() {
      this.ruleForm = {
        createUserId: this.$store.getters.userInfo.id,
        id: this.row.id,
        agentLevel: this.row.agentLevel,
        agentName: this.row.agentName,
        agentRatio: this.row.agentRatio,
        levelImg: this.row.levelImg,
        levelImgBucket: this.row.levelImgBucket,
      };
      if (this.row.levelImgUrl) {
        this.fileList = [{ url: this.row.levelImgUrl }];
      } else {
        this.fileList = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.row.id) {
            const comSubmit = () => {
              return saveScheme(this.ruleForm).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("新增成功");
                  this.row.callback(true);
                  Promise.resolve();
                }
              });
            };
            debounceCallBack(comSubmit)();
          } else {
            const comSubmit = () => {
              return updateScheme(this.ruleForm).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("编辑成功");
                  this.row.callback(true);
                  Promise.resolve();
                }
              });
            };
            debounceCallBack(comSubmit)();
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
