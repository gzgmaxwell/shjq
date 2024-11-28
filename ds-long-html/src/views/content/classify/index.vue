<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="APP标签"
        lazy
        name="first"
        v-if="permissions.classify_app"
      >
        <separate v-if="activeName == 'first'"></separate>
      </el-tab-pane>
      <el-tab-pane
        label="后台标签"
        lazy
        name="second"
        v-if="permissions.classify_web"
      >
        <backendTags v-if="activeName == 'second'"></backendTags>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import separate from "@/views/content/classify/component/separate.vue";
import backendTags from "@/views/content/classify/component/backendTags.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    separate,
    backendTags,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },
};
</script>
