<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="200px"
    style="width: 50%"
    class="demo-ruleForm"
  >
    <el-button type="primary" @click="submitForm('ruleForm')" class="mb10">{{
      $t("save")
    }}</el-button>
    <div class="titleBox">
      <div class="title">
        {{ $t("consumer_rights") }}
        <el-popover
          placement="top-start"
          trigger="hover"
          :content="$t('consumer_rights_tip')"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
      </div>
      <div>
        <el-switch v-model="ruleForm.isConsumeEnabled"></el-switch>
      </div>
    </div>
    <!-- <el-form-item
      :label="$t('recharge_coins')"
      prop="coinDiscount"
      v-if="ruleForm.isConsumeEnabled"
    >
      <el-input-number
        style="width: 40%"
        :placeholder="$t('recharge_coins')"
        :min="0.1"
        :max="9.9"
        :step="0.1"
        step-strictly
        v-model="ruleForm.coinDiscount"
      />
      <span class="ml10">{{ $t("discounts") }}</span>
    </el-form-item> -->
    <el-form-item
      :label="$t('paid_video')"
      prop="videoDiscount"
      v-if="ruleForm.isConsumeEnabled"
    >
      <el-input-number
        style="width: 40%"
        :placeholder="$t('paid_video')"
        :min="0.1"
        :max="9.9"
        :step="0.1"
        step-strictly
        v-model="ruleForm.videoDiscount"
      />
      <span class="ml10">{{ $t("discounts") }}</span>
    </el-form-item>
    <el-divider></el-divider>
    <div class="titleBox">
      <div class="title">
        {{ $t("offline_download_Benefits") }}
        <el-popover
          placement="top-start"
          trigger="hover"
          :content="$t('offline_download_Benefits_tip')"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
      </div>
      <div>
        <el-switch v-model="ruleForm.offlineDownloadEnabled"></el-switch>
      </div>
    </div>
    <el-form-item
      v-if="ruleForm.offlineDownloadEnabled"
      :label="$t('moreonthly_offline_downloads')"
      prop="offlineDownloadLimit"
    >
      <el-input-number
        style="width: 40%"
        :placeholder="$t('moreonthly_offline_downloads')"
        :min="1"
        :max="99999999999999"
        :step="1"
        step-strictly
        v-model="ruleForm.offlineDownloadLimit"
      />
    </el-form-item>
    <el-divider></el-divider>
    <div>
      <div class="titleBox">
        <div class="title">
          {{ $t("interactive_rights") }}
          <el-popover
            placement="top-start"
            trigger="hover"
            :content="$t('interactive_rights_tip')"
          >
            <span slot="reference" class="el-icon-question question"></span>
          </el-popover>
        </div>
        <div>
          <el-switch
            v-model="ruleForm.isInteractiveEnabled"
            @change="change"
          ></el-switch>
        </div>
      </div>
      <el-form-item label-width="260px">
        <div slot="label">
          <div class="pinlun">{{ $t("comment") }}</div>
          <div class="SVIP">{{ $t("comment_tip") }}</div>
        </div>
        <div class="hudongBox">
          <el-switch v-model="ruleForm.isCommentEnabled"></el-switch>
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label-width="260px">
        <div slot="label">
          <div class="pinlun">{{ $t("barrage") }}</div>
          <div class="SVIP">{{ $t("barrage_tip") }}</div>
        </div>
        <div class="hudongBox">
          <el-switch v-model="ruleForm.isDanmuEnabled"></el-switch>
        </div>
      </el-form-item>
      <!-- <el-divider></el-divider> -->
      <!-- <el-form-item label-width="260px">
        <div slot="label">
          <div class="pinlun">{{ $t("collect") }}</div>
          <div class="SVIP">{{ $t("collect_tip") }}</div>
        </div>
        <div class="hudongBox">
          <el-switch v-model="ruleForm.isCollectible"></el-switch>
        </div>
      </el-form-item> -->
    </div>
  </el-form>
</template>
<script>
import {
  benefitsConfigAddOrUpdate,
  memberBenefitsConfigQuery,
} from "@/api/business-manage/index";
import upload from "@/components/upload/index.vue";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {
    upload,
  },
  data() {
    return {
      ruleForm: {
        isConsumeEnabled: false,
        coinDiscount: "",
        videoDiscount: "",
        offlineDownloadEnabled: false,
        offlineDownloadLimit: "",
        isInteractiveEnabled: false,
        isCommentEnabled: false,
        isDanmuEnabled: false,
        // isCollectible: false,
      },

      rules: {
        // coinDiscount: [
        //   {
        //     required: true,
        //     message: "请输入0.1~9.9区间折扣数值",
        //     trigger: "blur",
        //   },
        // ],
        videoDiscount: [
          {
            required: true,
            message: "请输入0.1~9.9区间折扣数值",
            trigger: "blur",
          },
        ],
        offlineDownloadLimit: [
          {
            required: true,
            message: "请输入请输入大于0的整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    ruleForm: {
      handler(val) {
        // &&!val.isCollectible
        if (!val.isCommentEnabled && !val.isDanmuEnabled) {
          this.ruleForm.isInteractiveEnabled = false;
        }
        // || val.isCollectible
        if (val.isCommentEnabled || val.isDanmuEnabled) {
          this.ruleForm.isInteractiveEnabled = true;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      memberBenefitsConfigQuery().then((res) => {
        const data = res.data?.data || [];
        const item = data.find((v) => v.type === "SVIP") || {};
        this.ruleForm = item;
      });
    },
    change(val) {
      this.ruleForm.isInteractiveEnabled = val;
      this.ruleForm.isCommentEnabled = val;
      this.ruleForm.isDanmuEnabled = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },

    commit() {
      const params = {
        type: "SVIP",
        ...this.ruleForm,
      };
      benefitsConfigAddOrUpdate(params).then(() => {
        this.$message.success("保存成功");
        this.init();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.titleBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 20px;
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
.hudongBox {
  display: flex;
  justify-content: flex-end;
}
.pinlun {
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  line-height: 20px;
}
.SVIP {
  font-size: 12px;
  text-align: left;
  line-height: 20px;
}
</style>
