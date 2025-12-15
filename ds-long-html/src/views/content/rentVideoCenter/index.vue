<template>
  <managementVideo :webPageMenu="menuEnum.rentVideoCenter" />
</template>

<script>
import managementVideo from "@/views/content/management/index.vue";
import { menuEnum } from "@/util/util";
export default {
  name: "rentVideoCenter", // 租户视频中心
  components: {
    managementVideo,
  },
  data() {
    return {
      menuEnum: menuEnum,
    };
  },
};
</script>
