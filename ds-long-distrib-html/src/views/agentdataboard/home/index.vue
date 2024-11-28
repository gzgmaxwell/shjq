<template>
  <base-card>
    <channelBoard v-if="showPage === EnumWebmasterType.CHANNEL"></channelBoard>
    <cpaWebmasterBoard
      v-if="showPage === EnumWebmasterType.CPA_STATIONMASTER || showPage === EnumWebmasterType.CPT_STATIONMASTER"
    ></cpaWebmasterBoard>
    <cpsWebmasterBoard v-if="showPage === EnumWebmasterType.CPS_STATIONMASTER"></cpsWebmasterBoard>
  </base-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { distributorUserType } from "@/api/system/index.ts";
import { EnumWebmasterType } from "@/enums";
import channelBoard from "./components/channelBoard.vue";
import cpaWebmasterBoard from "./components/cpaWebmasterBoard.vue";
import cpsWebmasterBoard from "./components/cpsWebmasterBoard.vue";

const showPage = ref("");
const getUserInfo = () => {
  distributorUserType().then((res) => {
    showPage.value = res.data.data;
  });
};
onMounted(() => {
  getUserInfo();
});
</script>
