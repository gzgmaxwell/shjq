<template>
  <div>
    <div ref="lineRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import moment from "moment";

const lineRef = ref(null);
let chartInstance: any = null;

const props: any = defineProps({
  durationData: {
    type: Object,
    required: false,
  },
});

const initChart = () => {
  if (!lineRef.value) return;
  chartInstance = echarts.init(lineRef.value);
  const { substanceVipSeeMsVOList, substanceNotVipSeeMsVOList } = props.durationData;

  const vipSeeDate = substanceVipSeeMsVOList?.map((item: any) => item.seeDate.split(" ")[0]);
  const vipSeeMs = substanceVipSeeMsVOList?.map((item: any) => item.seeMs);

  const notVipSeeDate = substanceNotVipSeeMsVOList?.map((item: any) => item.seeDate.split(" ")[0]);
  const notVipSeeMs = substanceNotVipSeeMsVOList?.map((item: any) => item.seeMs);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        let xAxisText = params[0].axisValue;
        let result = `${xAxisText}<br>`;
        params.forEach((item: any) => {
          let formattedValue = moment.utc(parseInt(item.value)).format("HH:mm:ss");
          result += `${item.marker} ${item.seriesName}: ${formattedValue}<br>`;
        });
        return result;
      },
    },
    grid: {
      left: "0",
      top: "10%",
      right: "1%",
      bottom: "2%",
      containLabel: true,
    },
    legend: {
      data: ["会员", "非会员"],
    },
    xAxis: [
      {
        type: "category",
        data: [...new Set([...vipSeeDate, ...notVipSeeDate])],
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
          return `${moment.utc(parseInt(value.toString())).format("HH:mm:ss")}`;
        },
      },
    },
    series: [
      {
        name: "会员",
        type: "line",
        data: vipSeeMs,
      },
      {
        name: "非会员",
        type: "line",
        data: notVipSeeMs,
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
