<template>
  <div style="margin-bottom: 10px; font-size: 20px; text-align: center">已签名</div>
  <iosPromotablePackage :tab="props.tab" />
  <div style="margin: 20px 0 10px; font-size: 20px; text-align: center">未完成签名</div>
  <iosUnpromotablePackage :tab="props.tab" />
</template>

<script setup lang="ts">
import iosPromotablePackage from "./component/iosPromotablePackage.vue";
import iosUnpromotablePackage from "./component/iosUnpromotablePackage.vue";
const props: any = defineProps({
  tab: {
    type: String,
    required: false,
    default: "",
  },
});
</script>
