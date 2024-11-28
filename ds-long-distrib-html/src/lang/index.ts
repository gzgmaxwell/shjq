import { createI18n } from "vue-i18n";
import { useAppStore } from "@/store/modules/app";

// 本地语言包
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
import zhTwLocale from "./package/zh-tw";

const appStore = useAppStore();

const messages = {
  "zh-cn": {
    ...zhCnLocale,
  },
  "zh-tw": {
    ...zhTwLocale,
  },
  en: {
    ...enLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages,
  globalInjection: true,
});

export default i18n;
