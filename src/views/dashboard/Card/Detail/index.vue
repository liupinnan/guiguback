<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="card-conter">{{ count }}</div>
    <div class="card-chart">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {};
  },
  props: ["title", "count"],
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #9d9d9d;
}
.card-conter {
  font-size: 30px;
  padding: 5px 0 0 0;
}
.card-chart {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding: 10px 0;
}
</style>