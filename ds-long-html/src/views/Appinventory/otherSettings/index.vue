<template>
  <basic-container>
    <div v-if="this.permissions.sys_otherSettings_promoteSharing">
      <div class="permit">
        <span class="title">推广分享</span>
        <el-switch
          v-model="promoteSharingSwitch"
          @change="changePromoteSharing"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_promotionCode">
      <div class="permit">
        <span class="title">首页推广码弹窗开关</span>
        <el-switch
          v-model="promotionCodeSwitch"
          @change="changeShare"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_release">
      <div class="permit">
        <span class="title">发布</span>
        <el-switch
          v-model="releaseSwitch"
          @change="changePublish"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div>
      <div class="permit">
        <span class="title">身份卡引导页</span>
        <el-switch
          v-model="bootPageSwitch"
          @change="changeBootPage"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { enumDictionaryKey } from "@/util/util";
import { updateDictByKey } from "@/api/admin/index";
import { mapGetters } from "vuex";
import timeLeft from "./timeLeft.vue";
export default {
  components: {
    timeLeft,
  },
  data() {
    return {
      promoteSharingSwitch: 0,
      promotionCodeSwitch: 0,
      releaseSwitch: 0,
      bootPageSwitch: 0,
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      permissions: "permissions",
    }),
  },
  mounted() {
    this.$store.dispatch("actionDictionary");
    this.getDictionaryInfo();
  },
  methods: {
    getDictionaryInfo() {
      (this.dictionary?.EXTENSION_SHARE || []).forEach((v) => {
        if (v.dictionaryKey === enumDictionaryKey.EXTENSION_SHARE_SWITCH) {
          this.promoteSharingSwitch = v.dictionaryValue;
        }
      });
      (this.dictionary?.POPUP_BIND_INVITE_WINDOW || []).forEach((v) => {
        if (
          v.dictionaryKey === enumDictionaryKey.POPUP_BIND_INVITE_WINDOW_SWITCH
        ) {
          this.promotionCodeSwitch = v.dictionaryValue;
        }
      });
      (this.dictionary?.APPCONTROL || []).forEach((v) => {
        if (v.dictionaryKey === enumDictionaryKey.RELEASE_CONTROL) {
          this.releaseSwitch = v.dictionaryValue;
        }
      });
      (this.dictionary?.HOME_GUIDE_SETTING || []).forEach((v) => {
        if (v.dictionaryKey === enumDictionaryKey.HOME_GUIDE_SETTING) {
          this.bootPageSwitch = v.dictionaryValue;
        }
      });
    },
    changePromoteSharing() {
      const params = {
        dictionaryKey: enumDictionaryKey.EXTENSION_SHARE_SWITCH,
        dictionaryValue: this.promoteSharingSwitch,
      };
      updateDictByKey(params).then(() => {
        this.$message.success(
          this.promoteSharingSwitch == 0 ? "开启成功" : "关闭成功"
        );
        this.$store.dispatch("actionDictionary");
      });
    },
    changeShare() {
      const params = {
        dictionaryKey: enumDictionaryKey.POPUP_BIND_INVITE_WINDOW_SWITCH,
        dictionaryValue: this.promotionCodeSwitch,
      };
      updateDictByKey(params).then(() => {
        this.$message.success(
          this.promotionCodeSwitch == 0 ? "开启成功" : "关闭成功"
        );
        this.$store.dispatch("actionDictionary");
      });
    },
    changePublish() {
      const params = {
        dictionaryKey: enumDictionaryKey.RELEASE_CONTROL,
        dictionaryValue: this.releaseSwitch,
      };
      updateDictByKey(params).then(() => {
        this.$message.success(
          this.releaseSwitch == 0 ? "开启成功" : "关闭成功"
        );
        this.$store.dispatch("actionDictionary");
      });
    },
    changeBootPage() {
      const params = {
        dictionaryKey: enumDictionaryKey.HOME_GUIDE_SETTING,
        dictionaryValue: this.bootPageSwitch,
      };
      updateDictByKey(params).then(() => {
        this.$message.success(
          this.bootPageSwitch == 0 ? "开启成功" : "关闭成功"
        );
        this.$store.dispatch("actionDictionary");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.permit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
::v-deep .el-divider--horizontal {
  margin: 10px 0 30px 0;
}
</style>
