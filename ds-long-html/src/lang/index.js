import Vue from "vue";
import locale from "element-ui/lib/locale";
import store from "@/store";

// 引入自己的语言包
import zhCn from "./package/zh-cn";
import zhTw from "./package/zh-tw";
import en from "./package/en";

// element ui 国际化

import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import zhTwLocale from "element-ui/lib/locale/lang/zh-TW";
// 国际化
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

// 配置i18n语言包
const messages = {
  en: {
    ...en,
    ...enLocale,
  },
  "zh-cn": {
    ...zhCn,
    ...zhLocale,
  },
  "zh-tw": {
    ...zhTw,
    ...zhTwLocale,
  },
};
// 国际化配置
const i18n = new VueI18n({
  locale: store.state.common.lang, // 默认中文
  messages,
  silentTranslationWarn: true,
});
locale.i18n((key, value) => i18n.t(key, value)); // 将 Element UI 的翻译函数绑定到 Vue-i18n

export default i18n;
