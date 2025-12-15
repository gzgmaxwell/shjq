<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Android" lazy name="first">
        <androidPackage :row="row" v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="IOS" lazy name="second">
        <iosPackage :row="row" v-if="activeName == 'second'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import androidPackage from "./androidPackage.vue";
import iosPackage from "./iosPackage.vue";
export default {
  components: {
    androidPackage,
    iosPackage,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
