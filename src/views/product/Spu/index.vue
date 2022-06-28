<template>
  <div>
    <el-card style="margin: 10px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="secene != 0" />
    </el-card>
    <!--第一结构-->
    <div v-show="secene == 0">
      <el-card>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            label="spu名称"
            prop="spuName"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            label="spu描述"
            prop="description"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            prop="prop"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <!--按钮集合处-->
              <el-button
                title="添加SKU"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click="addSku(row)"
                circle
              ></el-button>
              <el-button
                title="修改"
                type="warning"
                size="small"
                icon="el-icon-edit"
                @click="updateSpu(row)"
                circle
              ></el-button>
              <el-button
                title="查看"
                type="info"
                size="small"
                icon="el-icon-info"
                @click="findAttr(row)"
                circle
              ></el-button>
              <el-popconfirm
                style="margin-left: 10px"
                title="确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  title="删除"
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  slot="reference"
                  circle
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 15]"
          :page-size="limit"
          layout="total, prev, pager, next, jumper, sizes"
          :total="total"
          align="center"
        >
        </el-pagination>
      </el-card>
    </div>
    <SpuForm v-show="secene == 1" @changeScene="changeScene" ref="spu" />
    <SkuForm v-show="secene == 2" ref="sku" @changeScenes="changeScenes" />
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skulist" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              style="width: 100px; height: 100px"
              :alt="row.skuDesc"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuFrom/index.vue";
import SpuForm from "./SpuForm/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      records: [],
      total: 0,
      secene: 0, //spu数据，2添加修改spu，添加sku
      dialogTableVisible: false, //控制dialog的显示与隐藏
      spu: {},
      skulist: [],
      loading: true,
    };
  },
  methods: {
    getCategoryId(cateFrom) {
      //获取category3Id的值
      console.log(cateFrom);
      this.category1Id = cateFrom.category1Id;
      this.category2Id = cateFrom.category2Id;
      this.category3Id = cateFrom.category3Id;
      this.getSpuList();
    },
    async getSpuList() {
      //获取SPU列表
      const { page, limit, category3Id } = this;
      let result = await this.$API.Spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      //改变每页显示多少条信息
      this.limit = limit;
      this.getSpuList();
    },
    handleCurrentChange(page) {
      //改变页数
      this.page = page;
      this.getSpuList();
    },
    addSpu() {
      //添加spu
      this.secene = 1;
      this.$refs.spu.addSupData(this.category3Id);
    },
    async deleteSpu(row) {
      let result = await this.$API.Spu.reqdeleteSup(row.id);
      if (result.code == 200) {
        this.$message({ message: "删除成功", type: "success" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      } else {
        this.$message({ message: "删除失败", type: "success" });
      }
    },
    addSku(row) {
      //添加sku
      this.secene = 2;
      this.$refs.sku.getData(
        this.category1Id,
        this.category2Id,
        this.category3Id,
        row
      );
    },
    updateSpu(row) {
      //修改spu
      this.secene = 1;
      this.$refs.spu.initspuData(row);
    },
    changeScene({ secene, flag }) {
      this.secene = secene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
      // this.getSpuList(this.page);
    },
    changeScenes({ secene, flag }) {
      this.secene = secene;
    },
    async findAttr(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      // console.log(row);
      let result = await this.$API.Sku.reqFindBySpuid(this.spu.id);
      if (result.code == 200) {
        this.skulist = result.data;
        this.loading = false;
      }
    },
    close(done) {
      this.loading = true;
      this.skulist = [];
      done();
    },
  },
  components: {
    SkuForm,
    SpuForm,
  },
};
</script>

<style>
</style>