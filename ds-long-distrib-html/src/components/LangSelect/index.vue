<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useAppStore } from "@/store/modules/app";
import { optionLanguage, EnumLanguage } from "@/enums";

const appStore = useAppStore();
const { locale } = useI18n();

function handleLanguageChange(lang: string) {
  locale.value = lang;
  appStore.changeLanguage(lang);
  if (lang === EnumLanguage.en) {
    ElMessage.success("Switch English Successful!");
  } else if (lang === EnumLanguage.zhTw) {
    ElMessage.success("切换繁体中文成功！");
  } else if (lang === EnumLanguage.zhCn) {
    ElMessage.success("切换简体中文成功！");
  }
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div>
      <svg-icon icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in optionLanguage"
          :key="item.value"
          :disabled="appStore.language === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
