<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <div class="clearfix">
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="first"> </el-tab-pane>
          <el-tab-pane label="访问量" name="second"> </el-tab-pane>
        </el-tabs>
        <div class="right">
          <span>今日</span>
          <span>本周</span>
          <span>本月</span>
          <span>本年</span>
          <!--v-model="value1"-->
          <el-date-picker
            style="width: 250px"
            size="mini"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="16"> </el-col>
          <el-col :span="8">
            <div class="rank">
              <span>{{ title }}排行榜</span>
              <ul class="uls">
                <li>
                  <span class="rindex">0</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span class="rindex">1</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>4</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>5</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>6</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>7</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "first",
    };
  },
  computed: {
    title() {
      return this.activeName == "first" ? "销售总额" : "访问量";
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
  margin-top: 15px;
}
.right {
  position: absolute;
  top: 20px;
  right: 0;
}
.right span {
  margin: 0 5px;
}
.charts {
  width: 50%;
  height: 300px;
  border: 1px solid red;
}
.uls {
  width: 100%;
  height: 300px;
  padding: 0;
}
.uls li {
  list-style: none;
  margin: 10px 0px;
}
.uls li span:nth-child(1) {
  width: 20px;
  height: 20px;
}
.uls li span:nth-child(2) {
  margin: 0 5px;
}
.rindex {
  display: block;
  float: left;
  background: black;
  border-radius: 50%;
  color: #fff;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>