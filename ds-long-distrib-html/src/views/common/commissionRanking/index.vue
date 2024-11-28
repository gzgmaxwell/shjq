<template>
  <el-card>
    <template #header>代理佣金贡献排名（前20名） </template>
    <div class="chooseBox">
      <span @click="chooseTime(EnumPeroid.week)" :class="active === EnumPeroid.week ? 'activeBule' : ''">本周</span>
      <span @click="chooseTime(EnumPeroid.month)" :class="active === EnumPeroid.month ? 'activeBule' : ''">本月</span>
      <span @click="chooseTime(EnumPeroid.half)" :class="active === EnumPeroid.half ? 'activeBule' : ''">半年</span>
      <span @click="chooseTime(EnumPeroid.year)" :class="active === EnumPeroid.year ? 'activeBule' : ''">全年</span>
    </div>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { agentYieldRank } from "@/api/system";
import { onMounted } from "vue";

const EnumPeroid = {
  week: 1,
  month: 2,
  half: 3,
  year: 4,
};

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
const active = ref(EnumPeroid.week);

const chooseTime = (type: any) => {
  if (active.value === type) return;
  active.value = type;
  getAgentYieldRank(type);
};

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
    feature: {},
  },
  legend: {
    data: ["佣金趋势"],
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
  ],
};

const xAxisHandle = (data: []) => {
  const arr = data.map((v: any) => v.agentName);
  options.xAxis[0].data = arr;
};
const seriesHandle = (data: []) => {
  const arr = data.map((v: any) => v.money);
  options.series[0].data = arr;
};

const minMaxHandle = (data: []) => {
  const arr = data.map((v: any) => v.money);
  const min = Math.min.apply(null, arr);
  const max = Math.max.apply(null, arr);
  const perInterval = (max - min) / 5;

  options.yAxis[0].min = min;
  options.yAxis[0].max = max;
  options.yAxis[0].interval = Number(Number(perInterval).toFixed(2));
};

const getAgentYieldRank = (peroid: number) => {
  agentYieldRank({ type: peroid }).then((res) => {
    const data = res.data.data || [];
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
  getAgentYieldRank(EnumPeroid.week);
});
</script>

<style lang="scss" scoped>
.chooseBox {
  span {
    padding: 5px;
    cursor: pointer;
  }
}
</style>
