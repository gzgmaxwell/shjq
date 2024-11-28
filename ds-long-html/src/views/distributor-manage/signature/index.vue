<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="未完成" lazy name="first">
          <tabs
            v-if="activeName === 'first'"
            :webPageMenu="EnumSignature.FAILED"
          />
        </el-tab-pane>
        <el-tab-pane label="已完成" lazy name="second">
          <tabs
            v-if="activeName === 'second'"
            :webPageMenu="EnumSignature.SIGNED"
          />
        </el-tab-pane>
        <el-tab-pane label="审核记录" lazy name="third">
          <tabsRecord v-if="activeName === 'third'" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { EnumSignature } from "@/util/util";
import tabs from "./tabs.vue";
import tabsRecord from "./tabsRecord.vue";
export default {
  components: {
    tabs,
    tabsRecord,
  },
  data() {
    return {
      activeName: "first",
      EnumSignature: EnumSignature,
    };
  },
};
</script>
