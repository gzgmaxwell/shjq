<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs" v-if="route.query.channelType === EnumWebmasterType.CHANNEL">
      <el-tab-pane label="充值数据" name="first">
        <disTotalData :tab="EnumDisType.CHARGE" v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="新增用户" name="second">
        <disTotalData :tab="EnumDisType.NEW_USER" v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
    <disTotalData v-else />
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { EnumWebmasterType, EnumDisType } from "@/enums";
import disTotalData from "./disTotalData.vue";

const route = useRoute();

const activeName = ref("first");
</script>

<style lang="scss">
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>
