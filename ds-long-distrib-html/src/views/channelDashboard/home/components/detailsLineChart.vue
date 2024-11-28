<template>
  <div>
    <div ref="lineRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const lineRef = ref(null);
let chartInstance: any = null;

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

const initChart = () => {
  if (!lineRef.value) return;
  chartInstance = echarts.init(lineRef.value);
  const retentionDate = props.detailsData.map((item: any) => item.retentionDate);
  const retention = props.detailsData.map((item: any) => parseInt(item.retention.split("%")[0]));

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        let result = "";
        params.forEach((item: any) => {
          result += `${item.axisValue}<br> ${item.seriesName}: ${item.value}%`;
        });
        return result;
      },
    },
    grid: {
      left: "0",
      top: "5%",
      right: "1%",
      bottom: "2%",
      containLabel: true,
    },
    // legend: {
    //   data: ["会员", "非会员"],
    // },
    xAxis: [
      {
        type: "category",
        data: retentionDate,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: { interval: 0, rotate: 45 },
      },
    ],
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#666",
        },
      },
      axisLabel: {
        formatter: function (value: any) {
          return value > 1 ? `${value}%` : `${value * 100}%`;
        },
      },
    },
    series: [
      {
        name: props.columnLabel,
        type: "line",
        data: retention,
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  const updateOption = {};
  chartInstance.setOption(updateOption);
};

onMounted(() => {
  nextTick(() => {
    initChart();
    updateChart();
  });
});
</script>
