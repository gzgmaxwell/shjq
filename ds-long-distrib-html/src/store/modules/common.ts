import { defineStore } from "pinia";
import { store } from "@/store";
import { dictionaryQueryListByKeys } from "@/api/common";
export const useCommonStore = defineStore(
  "common",
  () => {
    const dictionary = ref({});
    function setDictionary(data: any) {
      dictionary.value = data;
    }

    // 注销
    function getDictionary(params: any) {
      dictionaryQueryListByKeys(params).then((res) => {
        dictionary.value = res.data.data;
      });
    }

    return { dictionary, setDictionary, getDictionary };
  },
  {
    persist: true,
  }
);

// 非setup
export function useCommonStoreHook() {
  return useCommonStore(store);
}
