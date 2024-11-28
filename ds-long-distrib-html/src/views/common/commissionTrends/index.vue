<template>
  <el-card>
    <template #header>数据看板 （近12个月佣金趋势 ）</template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { distrYieldTrend } from "@/api/system";
import { onMounted } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "barChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

const info: any = ref({});

const options = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  toolbox: {
    feature: {
      // dataView: { show: true, readOnly: false },
      // magicType: { show: true, type: ["line", "bar"] },
      // restore: { show: true },
      // saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["佣金趋势", "佣金趋势折线图"],
  },
  xAxis: [
    {
      type: "category",
      data: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10月", "11月", "12月"],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "佣金趋势",
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: "{value} 元",
      },
    },
    {
      type: "value",
      name: "佣金趋势折线图",
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: "{value} 元",
      },
    },
  ],
  series: [
    {
      name: "佣金趋势",
      type: "bar",
      tooltip: {
        valueFormatter: function (value: any) {
          return value + "元";
        },
      },
      data: [90, 5, 6, 50, 6, 76, 135, 162, 32, 20, 6, 190],
    },
    {
      name: "佣金趋势折线图",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value: any) {
          return value + "元";
        },
      },
      data: [90, 5, 6, 50, 6, 76, 135, 162, 32, 20, 6, 190],
    },
  ],
};

const xAxisHandle = (data: []) => {
  const arr = data.map((v: any) => v.month);
  options.xAxis[0].data = arr;
};
const seriesHandle = (data: []) => {
  const arr = data.map((v: any) => v.money);
  options.series[0].data = arr;
  options.series[1].data = arr;
};

const minMaxHandle = (data: []) => {
  const arr = data.map((v: any) => v.money);
  const min = Math.min.apply(null, arr);
  const max = Math.max.apply(null, arr);
  const perInterval = (max - min) / 5;

  options.yAxis[0].min = min;
  options.yAxis[0].max = max;
  options.yAxis[0].interval = Number(Number(perInterval).toFixed(2));
  options.yAxis[1].min = min;
  options.yAxis[1].max = max;
  options.yAxis[1].interval = Number(Number(perInterval).toFixed(2));
};

const getDistrYieldTrend = () => {
  distrYieldTrend().then((res) => {
    const data = res.data.data || [];
    info.value = data;
    xAxisHandle(data);
    seriesHandle(data);
    minMaxHandle(data);
    // 图表初始化
    const chart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
    chart.setOption(options);
    // 大小自适应
    window.addEventListener("resize", () => {
      chart.resize();
    });
  });
};

onMounted(() => {
  getDistrYieldTrend();
});
</script>
