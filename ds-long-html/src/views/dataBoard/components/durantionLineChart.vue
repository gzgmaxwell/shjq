<template>
  <div class="com-container">
    <div class="com-chart" ref="line_ref" style="height: 600px"></div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    durationData: {
      type: Object,
      required: false,
      default: () => {},
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
      // 会员
      const vipSeeDate = this.durationData.substanceVipSeeMsVOList.map(
        (item) => item.seeDate.split(" ")[0]
      );
      const vipSeeMs = this.durationData.substanceVipSeeMsVOList.map((item) => {
        return item.seeMs;
      });
      // 非会员
      const notVipSeeDate = this.durationData.substanceNotVipSeeMsVOList.map(
        (item) => {
          return item.seeDate.split(" ")[0];
        }
      );
      const notVipSeeMs = this.durationData.substanceNotVipSeeMsVOList.map(
        (item) => {
          return item.seeMs;
        }
      );
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let xAxisText = params[0].axisValue;
            let result = `${xAxisText}<br>`;
            params.forEach((item) => {
              let formattedValue = moment
                .utc(parseInt(item.value))
                .format("HH:mm:ss");
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
          // top: "1%",
          // right: "1%",
          data: ["会员", "非会员"],
        },
        xAxis: [
          {
            type: "category",
            data: [...new Set([...vipSeeDate, ...notVipSeeDate])],
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
              return `${moment.utc(parseInt(value)).format("HH:mm:ss")}`;
            },
          },
        },

        series: [
          {
            name: "会员",
            type: "line",
            // stack: "总量",
            data: vipSeeMs,
          },
          {
            name: "非会员",
            type: "line",
            // stack: "总量",
            data: notVipSeeMs,
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
