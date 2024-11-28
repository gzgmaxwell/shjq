<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <div>
          <upload
            bucketType="GAME_CNETER"
            accept="image/png"
            @onChange="handleChange"
            :W2HRate="1 / 1"
            :maxFileSize="5"
            :limit="this.row.id ? 1 : 1000"
            :multiple="row.id ? false : true"
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { userAvatarSave, userAvatarUpdate } from "@/api/admin/index";
import upload from "@/components/upload/index.vue";
import { debounceCallBack } from "@/util/util";

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
        iconImg: [],
      },
      iconlist: [],
    };
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },
  methods: {
    handleChange(data) {
      if (data.length) {
        this.ruleForm.iconImg = data.map((item) => {
          return {
            avatar: item.key,
            avatarBucket: item.bucketName,
            type: "1",
          };
        });
      } else {
        this.ruleForm.iconImg = [];
      }
    },
    getInfo() {
      this.ruleForm = this.row;
      if (this.row.avatarFileUrl) {
        this.iconlist = [{ url: this.row.avatarFileUrl }];
      } else {
        this.iconlist = [];
      }
    },
    submitForm() {
      if (this.ruleForm.iconImg && this.ruleForm.iconImg.length == 0) {
        return this.$message.warning("请上传头像");
      }
      if (!this.row.id) {
        const comSubmit = () => {
          return userAvatarSave(this.ruleForm.iconImg).then(() => {
            this.$message.success("上传成功");
            this.row.callback(true);
            Promise.resolve();
          });
        };
        debounceCallBack(comSubmit)();
      } else {
        const params = {
          id: this.ruleForm.id,
          type: "1",
          ...(this.ruleForm.iconImg ? this.ruleForm.iconImg[0] : this.ruleForm),
        };
        const comSubmit = () => {
          return userAvatarUpdate(params).then(() => {
            this.$message.success("编辑成功");
            this.row.callback(true);
            Promise.resolve();
          });
        };
        debounceCallBack(comSubmit)();
      }
    },
  },
};
</script>
