<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <div class="titleBox">
        <div class="title">视频插播广告出现几率</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark" prop="insertRandomRatio">
        <div class="permit">
          <span> 随机几率 </span>
          <div style="display: flex">
            <el-input-number
              :min="0"
              :precision="0"
              :step="1"
              :max="100"
              v-model="ruleForm.insertRandomRatio"
            />
            <span class="ml10"> % </span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  insertRandomRatioSaveOrUpdate,
  insertRandomRatioGetRatio,
} from "@/api/admin/index";

import { debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: {
        insertRandomRatio: 1,
      },
      rules: {
        insertRandomRatio: [
          { required: true, message: "请输入出现几率", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      insertRandomRatioGetRatio().then((res) => {
        this.ruleForm.insertRandomRatio = res.data.data;
      });
    },
    submit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const params = {
            insertRandomRatio: this.ruleForm.insertRandomRatio,
          };
          const comSubmit = () => {
            return insertRandomRatioSaveOrUpdate(params).then(() => {
              this.$message.success("保存成功");
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
<style lang="scss" scoped>
.mark {
  ::v-deep .el-form-item__content {
    margin: 0 !important;
    .permit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0;
    }
  }
}
::v-deep .el-divider--horizontal {
  margin: 0;
  margin-bottom: 15px;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
.titleBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .question {
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
