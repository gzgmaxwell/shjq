<template>
  <basic-container>
    <avue-crud :data="data" :option="option"></avue-crud>
  </basic-container>
</template>

<script>
import { getData } from "@/api/admin/cache-monit.js";
import { cacheMonitOptions } from "@/const/crud/admin/cache-monit";
export default {
  data() {
    return {
      data: [],
      option: cacheMonitOptions,
    };
  },
  mounted() {
    getData().then((res) => {
    this.data = res.data.data;
    })
  },
};
</script>

<style lang="scss" scoped>
</style>
