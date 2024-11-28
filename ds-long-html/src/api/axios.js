import axios from "axios";
import { serialize, getTimeZone } from "@/util/util";
import NProgress from "nprogress";
import errorCode from "@/const/errorCode";
import router from "@/router/router";
import { Message } from "element-ui";
import "nprogress/nprogress.css";
import qs from "qs";
import store from "@/store";

axios.defaults.timeout = 30000;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
};
axios.defaults.withCredentials = true;
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "/web_api/api";
} else {
  axios.defaults.baseURL = "/api";
}

NProgress.configure({
  showSpinner: false,
});

axios.interceptors.request.use(
  (config) => {
    // NProgress.start();
    const isToken = (config.headers || {}).isToken === false;
    let token = store.getters.access_token;

    config.headers["Time-Zone"] = getTimeZone();
    if (token && !isToken) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (config.methods === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }
    const BusPlatformId = config.headers.selfplatformid || localStorage.getItem("BusPlatformId");
    if (BusPlatformId) {
      config.headers["bus-platform-id"] = BusPlatformId;
    }

    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    NProgress.done();
    const status = Number(res.status) || 200;
    const message = res.data.msg || errorCode[status] || errorCode["default"];
    if (status === 401) {
      if (res?.config?.url.includes("prm/web/user/valid")) {
        console.log(res);
        location.refresh();
      }
      store.dispatch("FedLogOut").then(() => {
        router.push({ path: "/login" });
      });
      return;
    }
    if (status === 200) {
      if (res.data.code && res.data.code === 40018) {
        return res;
      }
      if (res.data.code && res.data.code !== 200) {
        Message({
          message: message,
          type: "error",
        });
        return Promise.reject(new Error(message));
      }
      return res;
    }
    Message({
      message: message,
      type: "error",
    });
    return Promise.reject(new Error(message));
  },
  (error) => {
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default axios;
