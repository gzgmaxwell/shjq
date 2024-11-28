import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore, store } from "@/store";
import * as buffer from "buffer";

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = buffer.Buffer;
}

import "./permission.ts";

// 本地SVG图标
import "virtual:svg-icons-register";

// 国际化
import i18n from "@/lang/index";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 全局注册 状态管理(store)
const app = createApp(App);
setupStore(app);
store.use(piniaPluginPersistedstate);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(i18n).mount("#app");
