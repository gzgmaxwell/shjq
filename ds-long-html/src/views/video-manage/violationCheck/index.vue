<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="已分配"
          lazy
          name="first"
          v-if="permissions.vm_vc_tab_distributed"
        >
          <distributed v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane
          label="待分配"
          lazy
          name="second"
          v-if="permissions.vm_vc_tab_distribute"
        >
          <distribute v-if="activeName === 'second'" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import distribute from "./distribute.vue";
import distributed from "./distributed.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    distribute,
    distributed,
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
