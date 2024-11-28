<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="平台收益" lazy name="first">
        <platformRevenue v-if="activeName == 'first'"></platformRevenue>
      </el-tab-pane>
      <el-tab-pane label="渠道收益" lazy name="second">
        <channelRevenue v-if="activeName == 'second'"></channelRevenue>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import platformRevenue from "@/views/business-manage/channelRevenueDetail/platformRevenue.vue";
import channelRevenue from "@/views/business-manage/channelRevenueDetail/channelRevenue.vue";
export default {
  components: {
    platformRevenue,
    channelRevenue,
  },
  data() {
    return {
      activeName: "first",
    };
  },

  methods: {},
  mounted() {},
};
</script>
