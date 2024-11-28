<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="表格" lazy name="first">
        <el-table :data="props.detailsData" border v-if="activeName == 'first'">
          <el-table-column property="retentionDate" label="日期" align="center"></el-table-column>
          <el-table-column align="center" property="retention" :label="props.columnLabel"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="折线" lazy name="second">
        <detailsLineChart
          v-if="activeName == 'second'"
          :detailsData="props.detailsData"
          :columnLabel="props.columnLabel"
        ></detailsLineChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import detailsLineChart from "./detailsLineChart.vue";
const props: any = defineProps({
  detailsData: {
    type: Array,
    required: false,
    default: () => [],
  },
  columnLabel: {
    type: String,
    required: false,
  },
});
const activeName = ref("first");
</script>
