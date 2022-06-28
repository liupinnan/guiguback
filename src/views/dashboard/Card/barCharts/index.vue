<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barCharts",
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [23, 24, 23, 21, 28, 25, 36, 12, 34, 21, 28, 25],
        },
      ],
      tooltip: {},
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>