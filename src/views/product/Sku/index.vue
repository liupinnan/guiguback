<template>
  <div>
    <el-table border style="width: 100%" :data="skuList.records">
      <el-table-column label="序号" align="center" type="index" width="80">
      </el-table-column>
      <el-table-column label="名称" align="center" prop="skuName" width="width">
      </el-table-column>
      <el-table-column label="描述" align="center" prop="skuDesc" width="width">
      </el-table-column>
      <el-table-column label="默认图片" align="center" width="130">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(kg)"
        align="center"
        prop="weight"
        width="width"
      >
      </el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="80">
      </el-table-column>
      <el-table-column label="操作" align="center" prop="" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            title="点击上架"
            icon="el-icon-top"
            size="small"
            v-if="row.isSale == 0"
            @click="putaway(row)"
          ></el-button>
          <el-button
            title="点击下架"
            type="success"
            v-if="row.isSale == 1"
            icon="el-icon-bottom"
            size="small"
            @click="soldout(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="small"
            @click="getSkuInfo(row)"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!---
      -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout="prev,pager,next,total,jumper,sizes"
      :total="skuList.total"
      align="center"
    >
    </el-pagination>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="45%"
    >
      <el-row>
        <el-col :span="5">名称:</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述:</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格:</el-col>
        <el-col :span="16">{{ skuInfo.price }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性:</el-col>
        <el-col :span="16">
          <el-tag
            v-for="(item, index) in skuInfo.skuAttrValueList"
            :key="item.id"
            type="success"
            style="margin: 5px 5px"
            >{{ item.attrName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片:</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item
              v-for="(item, index) in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width:100%;height=100%" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      skuList: [],
      skuInfo: {},
      drawer: false,
      direction: "rtl",
    };
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.Sku.reqSkuList(page, limit);
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
      } else {
        this.$message({ message: "获取失败", type: "warning" });
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async putaway(row) {
      let result = await this.$API.Sku.reqOnlSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ message: "上架成功", type: "success" });
      }
    },
    async soldout(row) {
      let result = await this.$API.Sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ message: "下架成功", type: "success" });
      }
    },
    edit() {
      this.$message("正在开发中....");
    },
    async getSkuInfo(row) {
      this.drawer = true;
      let result = await this.$API.Sku.reqGetSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style scope>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: 700;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>