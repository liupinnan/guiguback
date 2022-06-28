<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="careForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="careForm.category1Id"
          @change="getList2"
          :disabled="show"
        >
          <el-option
            v-for="(item1, index) in list1"
            :key="item1.id"
            :label="item1.name"
            :value="item1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="careForm.category2Id"
          @change="getList3"
          :disabled="show"
        >
          <el-option
            v-for="(item2, index) in list2"
            :key="item2.id"
            :label="item2.name"
            :value="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          @change="getList4"
          v-model="careForm.category3Id"
          :disabled="show"
        >
          <el-option
            v-for="(item3, index) in list3"
            :key="item3.id"
            :label="item3.name"
            :value="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      careForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async getlist1() {
      let result = await this.$API.Attr.reqCategory1List();
      // console.log(result);
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async getList2() {
      this.list2 = [];
      this.list3 = [];
      this.careForm.category2Id = "";
      this.careForm.category3Id = "";
      const { category1Id } = this.careForm;
      let result = await this.$API.Attr.reqCategory2List(category1Id);
      // console.log(result);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async getList3() {
      this.list3 = [];
      this.careForm.category3Id = "";
      const { category2Id } = this.careForm;
      let result = await this.$API.Attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    getList4() {
      const { category3Id } = this.careForm;
      this.$emit("getCategoryId", this.careForm);
    },
  },
  mounted() {
    this.getlist1();
  },
};
</script>

<style>
</style>