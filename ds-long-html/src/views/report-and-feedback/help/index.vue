<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部问题" name="0">
        <whole v-if="activeName == '0'"></whole>
      </el-tab-pane>
      <el-tab-pane label="问题类型" name="1">
        <problem-type v-if="activeName == '1'"></problem-type>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import whole from "./whole.vue";
import problemType from "./problemType.vue";
export default {
  components: {
    whole,
    problemType,
  },
  data() {
    return {
      activeName: "0",
    };
  },
};
</script>
