<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="表格" lazy name="first">
        <el-table :data="detailsData" border v-if="activeName == 'first'">
          <el-table-column
            property="retentionDate"
            label="日期"
            align="center"
          ></el-table-column>
          <el-table-column
            align="center"
            property="retention"
            :label="columnLabel"
          ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="折线" lazy name="second">
        <detailsLineChart
          v-if="activeName == 'second'"
          :detailsData="detailsData"
          :columnLabel="columnLabel"
        ></detailsLineChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import detailsLineChart from "./detailsLineChart.vue";
export default {
  props: {
    detailsData: {
      type: Array,
      required: false,
      default: () => [],
    },
    columnLabel: {
      type: String,
      required: false,
    },
  },
  components: {
    detailsLineChart,
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
