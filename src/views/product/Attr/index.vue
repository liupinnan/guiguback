<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!attrShow" />
    </el-card>
    <el-card>
      <div v-show="attrShow">
        <el-button
          type="primary"
          @click="addAttr"
          icon="el-icon-plus"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table border :data="attrlist">
          <el-table-column
            type="index"
            prop="date"
            label="序号"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 3px 8px"
                type="success"
                v-for="(items, index) in row.attrValueList"
                :key="items.id"
                >{{ items.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="200" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="updataAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deletAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!attrShow">
        <el-form :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名" style="margin-top: 11px">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="addAttrValue()"
          :disabled="!attrInfo.attrName"
          >添加属性</el-button
        >
        <el-button @click="attrShow = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="100px"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flage"
                v-model="row.valueName"
                placeholder="请输入属性名称"
                @blur="toLook(row)"
                @keyup.native.enter="flage = toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                style="display: block; width: 100px; height: 20px"
                v-else
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="200px">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                @onConfirm="deletAttrValue($index)"
                :title="`确定删除“${row.valueName}”吗？？`"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttrInfo"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="attrShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrlist: [],
      attrShow: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(cateFrom) {
      this.category1Id = cateFrom.category1Id;
      this.category2Id = cateFrom.category2Id;
      this.category3Id = cateFrom.category3Id;
      this.getAttrList();
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.Attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrlist = result.data;
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flage: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      this.attrShow = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    updataAttr(row) {
      this.attrShow = false;
      this.attrInfo = JSON.parse(JSON.stringify(row));
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flage", false);
      });
    },
    async deletAttr(row) {
      console.log(row);
      console.log(row.attrValueList[0].attrId);
      let result = await this.$API.Attr.reqDeleAttr(
        row.attrValueList[0].attrId
      );
      this.getAttrList();
      // console.log(result);
    },
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      row.flage = false;
    },
    toEdit(row, index) {
      row.flage = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deletAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async saveAttrInfo() {
      this.attrInfo.addAttrValue = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flage;
            return true;
          }
        }
      );
      try {
        await this.$API.Attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        this.attrShow = true;
        this.getAttrList();
      } catch (error) {
        return Promise.reject(new Error("fila"));
      }
    },
  },
};
</script>

<style>
</style>