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
        <div class="title">预览视频数量</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span>每日预览上限</span>
          <el-switch
            v-model="ruleForm.previewLimit"
            active-value="0"
            inactive-value="1"
            @change="changeSwitch"
          >
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="limitNum">
        <div class="permit">
          <span> 上限数量 </span>
          <div class="sliderStyle">
            <el-slider
              v-model="ruleForm.limitNum"
              show-input
              :max="1000"
              :disabled="ruleForm.previewLimit == 1"
            ></el-slider>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { batchUpdateDictByKey } from "@/api/admin/index";
import { mapGetters } from "vuex";

import { enumDictionaryKey, debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: { previewLimit: 1, limitNum: 1 },
      rules: {
        limitNum: [
          {
            required: true,
            message: "请输入上限数量",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
    }),
  },

  mounted() {
    this.getDictionaryInfo();
  },

  methods: {
    getDictionaryInfo() {
      (this.dictionary?.preview_video || []).forEach((v) => {
        if (v.dictionaryKey == enumDictionaryKey.ENABLE_DAILY_PREVIEW_LIMIT) {
          this.ruleForm.previewLimit = v.dictionaryValue;
        }
        if (v.dictionaryKey == enumDictionaryKey.DAILY_PREVIEW_LIMIT) {
          this.ruleForm.limitNum = Number(v.dictionaryValue);
        }
      });
    },
    changeSwitch(val) {
      if (val == 1) {
        this.ruleForm.limitNum = 1;
      }
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            updateDictDTOList: [
              {
                dictionaryKey: enumDictionaryKey.ENABLE_DAILY_PREVIEW_LIMIT,
                dictionaryValue: this.ruleForm.previewLimit,
              },
              {
                dictionaryKey: enumDictionaryKey.DAILY_PREVIEW_LIMIT,
                dictionaryValue: this.ruleForm.limitNum,
              },
            ],
          };
          const comSubmit = () => {
            return batchUpdateDictByKey(params).then((res) => {
              this.$message.success("保存成功");
              this.$store.dispatch("actionDictionary");
              Promise.resolve();
            });
          };
          debounceCallBack(comSubmit)();
        } else {
          return false;
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
.sliderStyle {
  width: 50%;
  ::v-deep.el-slider__input {
    width: 160px;
  }
  ::v-deep.el-slider__runway.show-input {
    margin-right: 190px;
  }
}
</style>
