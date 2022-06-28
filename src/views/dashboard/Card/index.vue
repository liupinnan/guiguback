<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售量" count="¥ 126560">
            <template slot="charts">
              <span style="font-size: 12px"
                >周同比&nbsp;&nbsp;56.67%
                <i style="color: red" class="el-icon-caret-top"></i
              ></span>
              <span style="font-size: 12px; margin-left: 5px"
                >日同比&nbsp;&nbsp;56.67%
                <i style="color: green" class="el-icon-caret-bottom"></i
              ></span>
            </template>
            <template slot="footer">
              <span> 总销售量 </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span> 转化率 </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运用活动效果" count="88%">
            <template slot="charts">
              <ProgressChart></ProgressChart>
            </template>
            <template slot="footer">
              <span style="font-size: 12px"
                >周同比&nbsp;&nbsp;56.67%
                <i style="color: red" class="el-icon-caret-top"></i
              ></span>
              <span style="font-size: 12px; margin-left: 5px"
                >日同比&nbsp;&nbsp;56.67%
                <i style="color: green" class="el-icon-caret-bottom"></i
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail/index.vue";
import LineChart from "./lineChart/index.vue";
import BarCharts from "./barCharts/index.vue";
import ProgressChart from "./progressChart/index.vue";
export default {
  name: "Card",
  components: {
    Detail,
    LineChart,
    BarCharts,
    ProgressChart,
  },
};
</script>

<style>
</style>