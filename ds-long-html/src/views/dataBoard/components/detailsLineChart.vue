<template>
  <div class="com-container">
    <div class="com-chart" ref="line_ref" style="height: 600px"></div>
  </div>
</template>
<script>
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
  data() {
    return {
      // 实例对象
      chartInstance: "",
    };
  },
  mounted() {
    // 调用实例化对象
    this.initChart();
    //更新图例
    this.updateChart();
  },
  methods: {
    //初始化实例对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.line_ref);
      const retentionDate = this.detailsData.map((item) => item.retentionDate);
      const retention = this.detailsData.map((item) =>
        parseInt(item.retention.split("%")[0])
      );
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((item) => {
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
        //   // top: "1%",
        //   // right: "1%",
        //   data: ["会员", "非会员"],
        // },
        xAxis: [
          {
            type: "category",
            data: retentionDate,
            // 坐标轴文字与刻度对齐
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: { interval: 0, rotate: 45 },
          },
        ],
        yAxis: {
          type: "value",
          // 网络线
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#666",
            },
          },
          axisLabel: {
            formatter: (value) => {
              return value > 1 ? `${value}%` : `${value * 100}%`;
            },
          },
        },

        series: [
          {
            name: this.columnLabel,
            type: "line",
            // stack: "总量",
            data: retention,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    //更新图例
    updateChart() {
      const updateOption = {};
      this.chartInstance.setOption(updateOption);
    },
  },
};
</script>
