<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useSettingsStore } from "@/store/modules/settings";
import { useApiCom } from "@/store/modules/apiCom";
import { useRouter } from "vue-router";

const router = useRouter();

const settingsStore = useSettingsStore();
const apiCom = useApiCom();

let timer = ref<any>(null);

onMounted(() => {
  if (settingsStore.sysInfo) {
    timer.value = setInterval(() => {
      apiCom.actionGetList();
    }, 10000);
  }
});
watch(
  () => settingsStore.sysInfo,
  (val) => {
    if (val) {
      timer.value = setInterval(() => {
        apiCom.actionGetList();
      }, 10000);
    } else {
      clearInterval(timer.value);
    }
  }
);
</script>

<template>
  <div class="infonotice-container" v-if="settingsStore.sysInfo">
    <div class="info" v-if="apiCom.data" @click="() => router.push(`/cpsetting/message/index`)">{{ apiCom.data }}</div>
    <svg-icon size="1em" icon-class="bell" />
  </div>
</template>
<style lang="scss" scoped>
.infonotice-container {
  position: relative;

  .info {
    position: absolute;
    top: 5px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    font-size: 10px;
    color: white;
    background-color: red;
    border-radius: 50%;
  }
}
</style>
