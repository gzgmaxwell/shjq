<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane lazy name="first">
        <keyword v-if="activeName == 'first'"></keyword>
        <span slot="label" style="margin-right: 2px">关键词</span>
        <el-tooltip
          slot="label"
          content="当前下列关键词,搜索量已达到10"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-tab-pane>

      <el-tab-pane label="标签" lazy name="second">
        <tag v-if="activeName == 'second'"></tag>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import keyword from "@/views/content/searchStatistics/component/keyword.vue";
import tag from "@/views/content/searchStatistics/component/tag.vue";
export default {
  components: {
    keyword,
    tag,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
