<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="代理权益" lazy name="first">
        <agencyInterest v-if="activeName == 'first'"></agencyInterest>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import agencyInterest from "./component/agencyInterest.vue";
export default {
  components: {
    agencyInterest,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
