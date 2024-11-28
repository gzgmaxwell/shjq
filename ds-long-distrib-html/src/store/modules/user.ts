import { defineStore } from "pinia";
import { tokenLogout } from "@/api/auth";
import { getBindStatusByUsername } from "@/api/common";
import { store } from "@/store";
import { resetRouter } from "@/router";
export const useUserStore = defineStore(
  "userInfo",
  () => {
    const userInfo: any = ref({});
    function setUserInfo(data: any) {
      userInfo.value = data;
    }

    // 注销
    function logout() {
      return new Promise<void>((resolve, reject) => {
        tokenLogout()
          .then(() => {
            resetRouter();
            resetToken();
            location.reload(); // 清空路由
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    // 重置
    function resetToken() {
      userInfo.value = {};
      localStorage.removeItem("accessToken");
    }

    function actionGetBingStatus(params: any) {
      return new Promise((resolve, reject) => {
        getBindStatusByUsername(params.username)
          .then((res: any) => {
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }

    return { userInfo, setUserInfo, logout, resetToken, actionGetBingStatus };
  },
  {
    persist: true,
  }
);

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
