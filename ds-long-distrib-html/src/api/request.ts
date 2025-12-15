import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { resetRouter } from "@/router";
import { getTimeZone } from "@/utils/index";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API + "/api" : "/api",
  // baseURL: import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API : "/api",
  timeout: 5000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    config.headers["Time-Zone"] = getTimeZone();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    } else {
      console.info("token 无效");
    }
    const BusPlatformId = config.headers.selfplatformid || localStorage.getItem("BusPlatformId");
    if (BusPlatformId) {
      config.headers["bus-platform-id"] = BusPlatformId;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const status = Number(response.status) || 200;
    const message = response.data.msg || "系统错误";

    if (status === 200) {
      if (response.data.code && response.data.code !== 200) {
        ElMessage.error(message);
        return Promise.reject(new Error(message));
      }
      return response;
    }
    ElMessage.error(message);
    return Promise.reject(new Error(message));
  },
  (error: any) => {
    if (error.response.status === 500) {
      ElMessage.error(error.response.statusText || "系统出错");
      return Promise.reject(error.response.statusText || "系统出错");
    }

    if (error.response.status === 401) {
      localStorage.clear();
      resetRouter();
      console.log(error);
      return;
    }
    if (error.response.data) {
      const { code, msg } = error.response.data;
      if (code === 8888) {
        relogin();
      } else {
        ElMessage.error(msg || "系统出错");
        return Promise.reject(error.message);
      }
    }
    return Promise.reject(error.message);
  }
);

const relogin = () => {
  ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
    confirmButtonText: "确定",
    type: "warning",
  }).then(() => {
    localStorage.clear();
    resetRouter();
  });
};

export default service;
