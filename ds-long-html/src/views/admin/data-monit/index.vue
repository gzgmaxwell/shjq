<template>
  <basic-container>
    <avue-crud :data="data" :option="option"></avue-crud>
  </basic-container>
</template>

<script>
import {
  getData,
} from "@/api/admin/data-monit.js";
export default {
  data() {
    return {
      data: [],
      option: {
        border: true,
        align: "center",
        menuAlign: "center",
        addBtn: false,
        menu:false,
        column: [
          {label: "业务标识符",prop: "key",},
          {label: "最大ID",prop: "maxId",},
          {label: "步长",prop: "step",},
          {label: "更新时间",prop: "updateTime",},
        ],
      },
    };
  },
  mounted(){
     getData().then(res=>{
     this.data = res.data.data
     })
  },
};
</script>

<style lang="scss" scoped>
</style>
