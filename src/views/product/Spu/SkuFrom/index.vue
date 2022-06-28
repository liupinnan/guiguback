<template>
  <div>
    <el-card>
      <el-form label-width="80px">
        <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
        <el-form-item label="SKU名称">
          <el-input v-model="skuInfo.skuName" placeholder="输入名称"></el-input>
        </el-form-item>
        <!--<el-input placeholder="价格(元)"></el-input>-->
        <el-form-item label="价格(元)">
          <el-input-number
            v-model="skuInfo.price"
            controls-position="right"
            @change="handleChange"
            size="large"
            :min="1"
            :max="99999999"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量(kg)">
          <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            rows="4"
            placeholder="重量(kg)"
            v-model="skuInfo.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form :inline="true" label-width="80px">
            <el-form-item
              :label="attr.attrName"
              v-for="(attr, index) in attrInfoList"
              :key="attr.id"
            >
              <el-select placeholder="请选择" v-model="attr.attrIdorValue">
                <el-option
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attrValue.id}`"
                  v-for="(attrValue, index) in attr.attrValueList"
                  :key="attrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form :inline="true" label-width="80px">
            <el-form-item
              :label="AttrName.saleAttrName"
              v-for="(AttrName, index) in SpusaleAttrName"
              :key="AttrName.id"
            >
              <el-select placeholder="请选择" v-model="AttrName.saleIdorValue">
                <el-option
                  :value="`${AttrName.id}:${SaleAttrValue.id}`"
                  :label="SaleAttrValue.saleAttrValueName"
                  v-for="(
                    SaleAttrValue, index
                  ) in AttrName.spuSaleAttrValueList"
                  :key="SaleAttrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            border
            style="width: 100%"
            :data="SpuImageList"
            @selection-change="selectionchange"
          >
            <el-table-column
              type="selection"
              label=""
              width="100px"
              align="center"
            ></el-table-column>
            <el-table-column label="图片" width="width" align="center">
              <template slot-scope="{ row, $index }">
                <img
                  :src="row.imgUrl"
                  style="width: 100px; height: 100px"
                  alt=""
                />
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              width="width"
              align="center"
              prop="imgName"
            ></el-table-column>
            <el-table-column label="操作" width="width" align="center">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="primary"
                  v-if="row.isDefault == 0"
                  @click="changeDefault(row)"
                  >设置默认</el-button
                >
                <el-button type="success" v-if="row.isDefault == 1"
                  >默认成功</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},
      skuInfo: {
        spuId: 0,
        tmId: 0,
        category3Id: 0,
        price: 0,
        weight: "",
        skuName: "",
        skuDesc: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [
          //     "saleAttrId": 0,
          // "saleAttrValueId": 0,
        ],
      },
      SpuImageList: [],
      SpusaleAttrName: [],
      attrInfoList: [],
      imageList: [],
    };
  },
  computed: {},
  methods: {
    async getData(category1Id, category2Id, category3Id, spu) {
      //4
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.tmId = spu.tmId;
      this.skuInfo.spuId = spu.id;
      this.spu = spu;
      let result1 = await this.$API.Sku.reqSpuImageList(spu.id);
      if (result1.code == 200) {
        let list = result1.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.SpuImageList = list;
      }
      //4
      let result2 = await this.$API.Sku.reqSpuSaleAttrList(spu.id);
      if (result2.code == 200) {
        this.SpusaleAttrName = result2.data;
      }
      //5
      let result3 = await this.$API.Sku.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result3.code == 200) {
        this.attrInfoList = result3.data;
      }
    },
    handleChange(value) {
      // console.log(value);
    },
    selectionchange(selection) {
      this.imageList = selection;
    },
    changeDefault(row) {
      this.SpuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScenes", { secene: 0, flag: "" });
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      const { attrInfoList, skuInfo, SpusaleAttrName } = this;
      attrInfoList.forEach((item) => {
        if (item.attrIdorValue) {
          const [attrId, valueId] = item.attrIdorValue.split(":");
          this.skuInfo.skuAttrValueList.push({ attrId, valueId });
        }
      });
      SpusaleAttrName.forEach((item) => {
        if (item.saleIdorValue) {
          const [saleAttrId, saleAttrValueId] = item.saleIdorValue.split(":");
          this.skuInfo.skuSaleAttrValueList.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
      });
      skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImageId: item.id,
        };
      });
      let result = await this.$API.Sku.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ message: "添加成功", type: "success" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>