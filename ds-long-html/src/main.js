import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";
import axios from "./api/axios";
import VueAxios from "vue-axios";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
import AvueFormDesign from "@sscfaith/avue-form-design";
import "./permission"; // 权限
import "./error"; // 日志
import router from "./router/router";
import store from "./store";
import i18n from "@/lang/index"; //国际化
import * as echarts from "echarts"; //echarts
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import * as filters from "./filters"; // 全局filter
import "./styles/common.scss";
import basicContainer from "./components/basic-container/main";
import Router from "vue-router";

import ModalImage from "@/components/modalImage";
import ModalPreview from "@/components/modalPreview";
import ModalReject from "@/components/modalReject";
import ModalPatchAuthors from "@/components/modalPatchAuthors";
import ModalGraphic from "@/components/modalGraphic";
import ModalChapter from "@/components/modalChapter";


// 解决重复点击路由时报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
window.axios = axios;
Vue.use(VueAxios, axios);
Vue.use(ElementUI, {
  size: "small",
  menuType: "text",
});
Vue.use(Avue, {
  size: "small",
  menuType: "text",
});
Vue.prototype.$echarts = echarts;
Vue.use(router);

Vue.use(AvueFormDesign);
Vue.use(ModalImage);
Vue.use(ModalPreview);
Vue.use(ModalReject);
Vue.use(ModalPatchAuthors);
Vue.use(ModalGraphic);
Vue.use(ModalChapter);

// 注册全局容器
Vue.component("basicContainer", basicContainer);

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

//加载过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

//处理el-radio-group 浏览器兼容问题
Vue.directive("removeAriaHidden", {
  bind(el, binding) {
    const ariaEls = el.querySelectorAll(".el-radio__original");
    ariaEls.forEach((item) => {
      item.removeAttribute("aria-hidden");
    });
  },
});

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
