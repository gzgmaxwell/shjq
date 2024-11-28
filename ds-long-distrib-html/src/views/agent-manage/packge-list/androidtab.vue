<template>
  <div style="margin-bottom: 10px; font-size: 20px; text-align: center">已打包</div>
  <androidPromotablePackage :tab="props.tab" />
  <div style="margin: 20px 0 10px; font-size: 20px; text-align: center">未完成打包</div>
  <androidUnpromotablePackage :tab="props.tab" />
</template>

<script setup lang="ts">
import androidPromotablePackage from "./component/androidPromotablePackage.vue";
import androidUnpromotablePackage from "./component/androidUnpromotablePackage.vue";
const props: any = defineProps({
  tab: {
    type: String,
    required: false,
    default: "",
  },
});
</script>
