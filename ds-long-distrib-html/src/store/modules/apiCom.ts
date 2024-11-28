import { defineStore } from "pinia";
import { unreadCount } from "@/api/common";

export const useApiCom = defineStore(
  "apiCom",
  () => {
    // 注销
    const data = ref<any>({});
    function actionGetList() {
      new Promise((resolve, reject) => {
        unreadCount()
          .then((res: any) => {
            data.value = res.data.data;
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    }
    return { data, actionGetList };
  },
  {
    persist: true,
  }
);
