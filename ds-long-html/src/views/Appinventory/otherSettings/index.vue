<template>
  <basic-container v-if="computedPermissions">
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
    <div v-if="this.permissions.sys_otherSettings_bootPageSwitch">
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
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_cardGuidePopover">
      <div class="permit">
        <span class="title">保存身份卡任务强制引导弹窗</span>
        <el-switch
          v-model="cardGuidePopover"
          @change="changeCardGuidePopover"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_comic">
      <div class="permit">
        <span class="title">漫画版块</span>
        <el-switch
          v-model="comicBook"
          @change="changeComicBook"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_novel">
      <div class="permit">
        <span class="title">小说版块</span>
        <el-switch
          v-model="novel"
          @change="changeNovel"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_recommendAdConfig">
      <div class="permit">
        <span class="title">清屏状态展示广告</span>
        <el-switch
          v-model="recommendAdConfig"
          @change="changeRecommendAdConfig"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
      <el-divider></el-divider>
    </div>
    <div v-if="this.permissions.sys_otherSettings_nationalAgent">
      <div class="permit">
        <span class="title">全民代理</span>
        <el-switch
          v-model="nationalAgent"
          @change="changeNationalAgent"
          active-value="0"
          inactive-value="1"
        >
        </el-switch>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  enumPermissionsKey,
  enumDictionaryKey,
  enumDictionaryName,
} from "@/util/util";
import { updateDictByKey } from "@/api/admin/index";
import { mapGetters } from "vuex";
// import timeLeft from "./timeLeft.vue";

export default {
  components: {
    // timeLeft,
  },
  data() {
    return {
      promoteSharingSwitch: "0",
      promotionCodeSwitch: "0",
      releaseSwitch: "0",
      bootPageSwitch: "0",
      cardGuidePopover: "0",
      comicBook: "0",
      novel: "0",
      recommendAdConfig: "0",
      nationalAgent: "0",
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      permissions: "permissions",
    }),
    computedPermissions() {
      return enumPermissionsKey.some((key) => this.permissions[key]);
    },
  },
  mounted() {
    this.$store.dispatch("actionDictionary");
    this.getDictionaryInfo();
  },
  methods: {
    get_updateDictByKey(params, val) {
      updateDictByKey(params).then(() => {
        this.$message.success(val === "0" ? "开启成功" : "关闭成功");
        this.$store.dispatch("actionDictionary");
      });
    },
    getDictionaryInfo() {
      const getValue = (dictName, key) => {
        return this.dictionary?.[dictName]?.find((v) => v.dictionaryKey === key)
          ?.dictionaryValue;
      };

      // 按需赋值
      this.promoteSharingSwitch = getValue(
        enumDictionaryName.EXTENSION_SHARE,
        enumDictionaryKey.EXTENSION_SHARE_SWITCH
      );
      this.promotionCodeSwitch = getValue(
        enumDictionaryName.POPUP_BIND_INVITE_WINDOW,
        enumDictionaryKey.POPUP_BIND_INVITE_WINDOW_SWITCH
      );
      this.releaseSwitch = getValue(
        enumDictionaryName.APPCONTROL,
        enumDictionaryKey.RELEASE_CONTROL
      );
      this.bootPageSwitch = getValue(
        enumDictionaryName.HOME_GUIDE_SETTING,
        enumDictionaryKey.HOME_GUIDE_SETTING
      );
      this.cardGuidePopover = getValue(
        enumDictionaryName.MANDATORY_SAVING_IDENTITY_CARDS_SETTING,
        enumDictionaryKey.MANDATORY_SAVING_IDENTITY_CARDS_SETTING_SWITCH
      );
      this.comicBook = getValue(
        enumDictionaryName.INK_LORE_CONFIG,
        enumDictionaryKey.INK_LORE_COMIC
      );
      this.novel = getValue(
        enumDictionaryName.INK_LORE_CONFIG,
        enumDictionaryKey.INK_LORE_NOVEL
      );
      this.recommendAdConfig = getValue(
        enumDictionaryName.RECOMMEND_AD_CONFIG,
        enumDictionaryKey.RECOMMEND_AD_CONFIG
      );
      this.nationalAgent = getValue(
        enumDictionaryName.EXTENSION_ENTRANCE_CONFIG,
        enumDictionaryKey.EXTENSION_ENTRANCE_CONFIG
      );
    },

    changePromoteSharing(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.EXTENSION_SHARE_SWITCH,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeShare(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.POPUP_BIND_INVITE_WINDOW_SWITCH,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changePublish(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.RELEASE_CONTROL,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeBootPage(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.HOME_GUIDE_SETTING,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeCardGuidePopover(val) {
      const params = {
        dictionaryKey:
          enumDictionaryKey.MANDATORY_SAVING_IDENTITY_CARDS_SETTING_SWITCH,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeComicBook(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.INK_LORE_COMIC,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeNovel(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.INK_LORE_NOVEL,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeRecommendAdConfig(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.RECOMMEND_AD_CONFIG,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
    },
    changeNationalAgent(val) {
      const params = {
        dictionaryKey: enumDictionaryKey.EXTENSION_ENTRANCE_CONFIG,
        dictionaryValue: val,
      };
      this.get_updateDictByKey(params, val);
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
