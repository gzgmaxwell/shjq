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
        <div class="title">时间戳</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark" prop="interTime">
        <div class="permit">
          <span> 创建间隔时间 </span>
          <div style="display: flex">
            <el-input-number
              :min="0"
              :precision="0"
              :step="1"
              :max="999"
              v-model="ruleForm.interTime"
            />
            <span class="ml10"> 秒 </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="topLimit">
        <div class="permit">
          <span> 每日次数上限 </span>
          <div style="display: flex">
            <el-input-number
              :min="0"
              :precision="0"
              :step="1"
              :max="999"
              v-model="ruleForm.topLimit"
            />
            <span class="ml10"> 次 </span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { tssetting_saveOrUpdate } from "@/api/admin/index";

import { debounceCallBack, enumDictionaryKey } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      ruleForm: {
        interTime: 30,
        topLimit: 30,
      },
      rules: {
        interTime: [
          { required: true, message: "请输入创建间隔时间", trigger: "change" },
        ],
        topLimit: [
          { required: true, message: "请输入每日次数上限", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
    }),
  },

  methods: {
    getInfo() {
      this.dictionary.VIDEO_TIMESTAMP_SETTING.forEach((v) => {
        if (v.dictionaryKey == enumDictionaryKey.CREATE_INTERVAL_TIME) {
          this.ruleForm.interTime = v.dictionaryValue;
        }
        if (v.dictionaryKey == enumDictionaryKey.DAILY_LIMIT_COUNT) {
          this.ruleForm.topLimit = v.dictionaryValue;
        }
      });
    },
    submit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const params = [
            {
              key: "CREATE_INTERVAL_TIME",
              value: this.ruleForm.interTime,
            },
            {
              key: "DAILY_LIMIT_COUNT",
              value: this.ruleForm.topLimit,
            },
          ];
          const comSubmit = () => {
            return tssetting_saveOrUpdate(params).then(() => {
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
