<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="超级会员" lazy name="first">
          <svip />
        </el-tab-pane>
        <!-- <el-tab-pane label="vip" lazy name="second">
          <vip />
        </el-tab-pane> -->
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import svip from "./component/svip.vue";
import vip from "./component/vip.vue";
export default {
  components: {
    svip,
    vip,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
